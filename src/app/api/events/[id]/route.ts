import { NextRequest, NextResponse } from 'next/server';
import prisma from '~/lib/prisma';
import { bigIntToString } from '~/lib/bigIntToString';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const eventId = params.id;

    // Get userId from query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    try {
        // Fetch the event, including ideas and user votes for the specified user
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                author: true,
                Idea: {
                    include: {
                        author: true,
                        userVotes: {
                            where: {
                                userId: userId || undefined, // Include userVotes for this user
                            },
                        },
                    },
                },
            },
        });

        if (!event) {
            return NextResponse.json({ message: 'Event not found' }, { status: 404 });
        }

        // Map the data to match the frontend interface and include userVote
        const eventData = {
            id: event.id,
            name: event.name,
            description: event.description,
            author: event.author,
            Idea: event.Idea.map((idea) => {
                // Determine the user's vote for this idea
                const userVote =
                    idea.userVotes[0]?.type === 'LIKE'
                        ? 'LIKE'
                        : idea.userVotes[0]?.type === 'DISLIKE'
                            ? 'DISLIKE'
                            : null;

                return {
                    id: idea.id,
                    title: idea.title,
                    description: idea.description,
                    likes: idea.likes,
                    dislikes: idea.dislikes,
                    author: idea.author,
                    userVote,
                };
            }),
        };

        // Convert BigInt values to strings
        const serializedEventData = bigIntToString(eventData);

        return NextResponse.json(serializedEventData);
    } catch (error) {
        console.error('Error fetching event:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
