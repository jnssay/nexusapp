import { PrismaClient, VoteType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create a user
    const user = await prisma.user.create({
        data: {
            telegramId: BigInt(123456789),
            firstName: 'Janessa',
            lastName: 'Yang',
            username: 'janessa',
        },
    });

    // Create ideas
    await prisma.idea.createMany({
        data: [
            {
                id: 'idea1',
                title: 'Classic Literature Night',
                description: "An evening dedicated to discussing classics like 'Pride and Prejudice' and 'Moby Dick'.",
                likes: 15,
                dislikes: 2,
                userId: user.id,
            },
            // Add other ideas here...
        ],
    });
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
