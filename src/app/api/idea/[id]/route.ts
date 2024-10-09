import { NextResponse } from 'next/server';
import prisma from '~/lib/prisma';

/**
 * Interface representing the expected structure of the incoming request body for creating a new idea.
 */
interface IdeaRequestBody {
    title: string;
    description: string;
    eventId: string;
    userId: string;
}

// Utility function to convert BigInt to string
function bigIntToString(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(bigIntToString);

    const newObj: any = {};
    for (const key in obj) {
        const value = obj[key];
        if (typeof value === 'bigint') {
            newObj[key] = value.toString();
        } else if (typeof value === 'object') {
            newObj[key] = bigIntToString(value);
        } else {
            newObj[key] = value;
        }
    }
    return newObj;
}

/**
 * Creates a new idea with the provided title, description, event ID, and user ID.
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
    const { title, description, userId } = await request.json();

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

        return NextResponse.json(newIdea, { status: 201 });
    } catch (error) {
        console.error('Error creating idea:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}