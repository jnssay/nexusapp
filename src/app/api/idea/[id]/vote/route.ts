import { NextRequest, NextResponse } from 'next/server';
import prisma from '~/lib/prisma';
import { bigIntToString } from '~/lib/bigIntToString';

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const ideaId = params.id;
    const { voteType, userId } = await req.json();

    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized: No user ID provided' }, { status: 401 });
    }

    try {
        // Find the existing vote, if any
        const existingVote = await prisma.userVote.findFirst({
            where: { ideaId, userId },
        });

        if (existingVote) {
            if (voteType === null) {
                // User wants to remove their vote
                await prisma.userVote.delete({ where: { id: existingVote.id } });

                // Decrement the like or dislike count
                await prisma.idea.update({
                    where: { id: ideaId },
                    data:
                        existingVote.type === 'LIKE'
                            ? { likes: { decrement: 1 } }
                            : { dislikes: { decrement: 1 } },
                });
            } else if (existingVote.type !== voteType) {
                // User is changing their vote
                await prisma.userVote.update({
                    where: { id: existingVote.id },
                    data: { type: voteType },
                });

                // Update the counts
                await prisma.idea.update({
                    where: { id: ideaId },
                    data: {
                        likes: voteType === 'LIKE' ? { increment: 1 } : { decrement: 1 },
                        dislikes: voteType === 'DISLIKE' ? { increment: 1 } : { decrement: 1 },
                    },
                });
            } else {
                // User clicked the same vote type, remove the vote
                await prisma.userVote.delete({ where: { id: existingVote.id } });

                // Decrement the like or dislike count
                await prisma.idea.update({
                    where: { id: ideaId },
                    data:
                        voteType === 'LIKE'
                            ? { likes: { decrement: 1 } }
                            : { dislikes: { decrement: 1 } },
                });
            }
        } else if (voteType !== null) {
            // User is voting for the first time
            await prisma.userVote.create({
                data: {
                    type: voteType,
                    user: { connect: { id: userId } },
                    idea: { connect: { id: ideaId } },
                },
            });

            // Increment the like or dislike count
            await prisma.idea.update({
                where: { id: ideaId },
                data:
                    voteType === 'LIKE'
                        ? { likes: { increment: 1 } }
                        : { dislikes: { increment: 1 } },
            });
        }

        // Fetch the updated idea with the user's vote
        const updatedIdea = await prisma.idea.findUnique({
            where: { id: ideaId },
            include: {
                author: true,
                userVotes: {
                    where: { userId },
                },
            },
        });

        if (!updatedIdea) {
            return NextResponse.json({ message: 'Idea not found' }, { status: 404 });
        }

        // Map the idea data to match your frontend interface
        const ideaData = {
            id: updatedIdea.id,
            title: updatedIdea.title,
            description: updatedIdea.description,
            likes: updatedIdea.likes,
            dislikes: updatedIdea.dislikes,
            author: updatedIdea.author,
            userVote:
                updatedIdea.userVotes[0]?.type === 'LIKE'
                    ? 'LIKE'
                    : updatedIdea.userVotes[0]?.type === 'DISLIKE'
                        ? 'DISLIKE'
                        : null,
        };

        const serializedIdeaData = bigIntToString(ideaData);

        return NextResponse.json(serializedIdeaData);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
