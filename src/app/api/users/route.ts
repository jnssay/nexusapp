import { NextResponse } from 'next/server';
import prisma from '~/lib/prisma';

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

export async function POST(request: Request) {
    try {
        // Parse the request body as JSON
        const body = await request.json();
        const { id, firstName, lastName, username } = body;

        // Log the entire request body for debugging
        console.log("Request Body:", body);

        if (!id || !firstName) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Try to find the user by telegramId
        let user = await prisma.user.findUnique({
            where: { telegramId: BigInt(id) },
        });

        // If the user doesn't exist, create a new one
        if (!user) {
            user = await prisma.user.create({
                data: {
                    telegramId: BigInt(id),
                    firstName,
                    lastName,
                    username,
                },
            });
        }

        const userSerialized = bigIntToString(user);

        return NextResponse.json(userSerialized);
    } catch (error: any) {
        console.error('Error creating/checking user:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
