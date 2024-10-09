import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDatabase() {
    const user = await prisma.user.create({
        data: {
            telegramId: BigInt('987654321'),
            firstName: 'John',
            lastName: 'Doe',
            username: 'john_doe',
        },
    });

    console.log('Seeded user:', user);

    const event1 = await prisma.event.create({
        data: {
            name: 'Sunday Book Club',
            description: "Let's get together to read books together!",
            chatId: '123456789',
            status: 'CONFIRMED',
            author: {
                connect: { id: user.id }
            },
        }
    });

    console.log('Seeded event:', event1);

    return event1.id; // Return the event ID
}

seedDatabase()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
