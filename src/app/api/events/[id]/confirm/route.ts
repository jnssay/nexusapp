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
                        author: true, // Include author details of the confirmed idea
                    },
                },
            },
        });

        // Map the data to include the full confirmed idea details
        const eventData = {
            id: updatedEvent.id,
            name: updatedEvent.name,
            description: updatedEvent.description,
            status: updatedEvent.status,
            confirmedIdea: updatedEvent.Idea_Event_confirmedIdeaIdToIdea, // Include the confirmed idea object
        };

        // Convert BigInt values to strings
        const sanitizedEvent = bigIntToString(eventData);

        return NextResponse.json(sanitizedEvent, { status: 200 });
    } catch (error) {
        console.error('Error confirming idea:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
