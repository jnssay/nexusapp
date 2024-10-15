// app/api/event/[eventId]/confirm/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '~/lib/prisma';
import { bigIntToString } from '~/lib/bigIntToString';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { ideaId } = await req.json();

        // Validate input
        if (!ideaId || typeof ideaId !== 'string') {
            return NextResponse.json({ error: 'Invalid ideaId provided.' }, { status: 400 });
        }

        // Verify that the idea belongs to the event
        const idea = await prisma.idea.findUnique({
            where: { id: ideaId },
            select: { event_id: true },
        });

        if (!idea) {
            return NextResponse.json({ error: 'Idea not found.' }, { status: 404 });
        }

        if (idea.event_id !== params.id) {
            return NextResponse.json({ error: 'Idea does not belong to the specified event.' }, { status: 400 });
        }

        // Update the event's status and set the confirmedIdeaId
        const updatedEvent = await prisma.event.update({
            where: { id: params.id },
            data: {
                status: 'CONFIRMED',
                confirmedIdeaId: ideaId,
            },
            include: {
                Idea_Event_confirmedIdeaIdToIdea: {
                    include: {
                        author: true, // Include author details if needed
                    },
                },
            },
        });

        const sanitizedEvent = bigIntToString(updatedEvent);

        return NextResponse.json(sanitizedEvent, { status: 200 });
    } catch (error) {
        console.error('Error confirming idea:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
