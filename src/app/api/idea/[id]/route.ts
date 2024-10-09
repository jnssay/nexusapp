import { NextResponse } from 'next/server';
import prisma from '~/lib/prisma';
import { bigIntToString } from '~/lib/bigIntToString';

/**
 * Interface representing the expected structure of the incoming request body for creating a new idea.
 */
interface IdeaRequestBody {
    title: string;
    description: string;
    eventId: string;
    userId: string;
}

/**
 * Creates a new idea with the provided title, description, event ID, and user ID.
 */
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { title, description, userId } = (await request.json()) as IdeaRequestBody;

    try {
        // Create the new idea associated with the eventId from params
        const newIdea = await prisma.idea.create({
            data: {
                title,
                description,
                event_id: params.id, // Use the event ID from the URL params
                userId,
            },
        });

        // Convert BigInts to strings in the newIdea object
        const ideaData = bigIntToString(newIdea);

        return NextResponse.json(ideaData, { status: 201 });
    } catch (error) {
        console.error('Error creating idea:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}