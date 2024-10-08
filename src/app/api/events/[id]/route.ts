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

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const event = await prisma.event.findUnique({
            where: {
                id: params.id,
            },
            include: {
                author: true,
                Idea: {
                    include: {
                        author: true,
                    },
                },
            },
        });

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        const eventSerialized = bigIntToString(event);

        return NextResponse.json(eventSerialized);
    } catch (error: any) {
        console.error('Error fetching event:', error);
        return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
    }
}