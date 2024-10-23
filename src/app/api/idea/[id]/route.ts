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


function customJsonStringify(obj: any): string {
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'bigint') {
            return value.toString();
        }
        if (Object.prototype.toString.call(value) === '[object Date]') {
            return value.toISOString();
        }
        return value;
    });
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

        // Convert BigInts and Dates to strings in the newIdea object
        const serializedIdea = customJsonStringify(newIdea);


        return NextResponse.json(serializedIdea, { status: 201 });
    } catch (error) {
        console.error('Error creating idea:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * Deletes an existing idea by ID.
 */
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const ideaId = params.id; // Assume the idea ID is passed as a URL parameter

    try {
        // Check if the idea exists
        const existingIdea = await prisma.idea.findUnique({
            where: { id: ideaId },
        });

        if (!existingIdea) {
            return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
        }

        // Delete the idea
        await prisma.idea.delete({
            where: { id: ideaId },
        });

        return NextResponse.json({ message: 'Idea deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting idea:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

function serializeDateFields(object: any) {
    if (!object) return object;

    // Iterate over the object's keys and convert Date objects to ISO strings
    return Object.keys(object).reduce((acc, key) => {
        const value = object[key];
        if (value instanceof Date) {
            acc[key] = value.toISOString();
        } else if (typeof value === 'object' && value !== null) {
            acc[key] = serializeDateFields(value); // Recursively serialize nested objects
        } else {
            acc[key] = value;
        }
        return acc;
    }, {} as any);
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { title, description, userId } = await request.json(); // Include userId
    const ideaId = params.id;

    try {
        // Set `editedAt` only when the title or description is changed
        const dataToUpdate: { title?: string; description?: string; editedAt?: Date } = {};

        if (title) {
            dataToUpdate.title = title;
        }

        if (description) {
            dataToUpdate.description = description;
        }

        // If either the title or description is updated, set `editedAt`
        if (title || description) {
            dataToUpdate.editedAt = new Date(); // Set the `editedAt` timestamp
        }

        // Update the idea
        await prisma.idea.update({
            where: { id: ideaId },
            data: dataToUpdate,
        });

        // Fetch the updated idea with the user's vote
        const updatedIdea = await prisma.idea.findUnique({
            where: { id: ideaId },
            include: {
                author: true,
                userVotes: {
                    where: { userId }, // Get the vote for the current user
                },
            },
        });

        if (!updatedIdea) {
            return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
        }

        // Map the idea data to match your frontend interface
        const ideaData = {
            id: updatedIdea.id,
            title: updatedIdea.title,
            description: updatedIdea.description,
            likes: updatedIdea.likes,
            dislikes: updatedIdea.dislikes,
            author: updatedIdea.author,
            createdAt: updatedIdea.createdAt,
            updatedAt: updatedIdea.updatedAt,
            editedAt: updatedIdea.editedAt,
            userVote:
                updatedIdea.userVotes[0]?.type === 'LIKE'
                    ? 'LIKE'
                    : updatedIdea.userVotes[0]?.type === 'DISLIKE'
                        ? 'DISLIKE'
                        : null,
        };

        // Serialize BigInts and Dates
        const serializedIdea = bigIntToString(ideaData);

        return NextResponse.json(serializedIdea);
    } catch (error) {
        console.error('Error updating idea:', error);
        return NextResponse.json({ error: 'Failed to update idea' }, { status: 500 });
    }
}