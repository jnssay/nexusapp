// app/api/event/[eventId]/confirm/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '~/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { eventId: string } }) {
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

        if (idea.event_id !== params.eventId) {
            return NextResponse.json({ error: 'Idea does not belong to the specified event.' }, { status: 400 });
        }

        // Update the event's status and set the confirmedIdeaId
        const updatedEvent = await prisma.event.update({
            where: { id: params.eventId },
            data: {
                status: 'COMPLETED',
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

        return NextResponse.json(updatedEvent, { status: 200 });
    } catch (error) {
        console.error('Error confirming idea:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
