import { NextResponse } from 'next/server';
import prisma from '~/lib/prisma';


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
 * Fetches an idea by its ID.
 * 
 * @param {Request} request - The incoming request object.
 * @returns {Promise<Response>} - A promise that resolves to the response object containing the idea data or an error message.
 */

export async function GET(request: Request, { params }: { params: { id: string } }) {

    try {
        const idea = await prisma.idea.findUnique({
            where: { id: params.id },
            include: {
                author: true,
                Event: true,
                userVotes: true,
            },
        });

        if (!idea) {
            return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
        }

        return NextResponse.json(bigIntToString(idea));
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


interface IdeaRequestBody {
    title: string;
    description: string;
    eventId: string;
    userId: string;
}

// Create Idea with Idea name and Idea Description based on Event Id
// POST /

/**
 * Creates a new idea with the provided title, description, event ID, and user ID.
 * 
 * @param {Request} request - The incoming request object containing the idea data in JSON format.
 * @returns {Promise<Response>} - A promise that resolves to the response object containing the newly created idea data or an error message.
 */

export async function POST(request: Request) {
    const { title, description, eventId, userId }: IdeaRequestBody = await request.json();

    try {
        const newIdea = await prisma.idea.create({
            data: {
                title,
                description,
                eventId,
                userId,
            },
        });

        return NextResponse.json(bigIntToString(newIdea), { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
