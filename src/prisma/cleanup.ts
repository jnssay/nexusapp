import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
    try {
        // Delete events related to a specific user by telegramId (or you can use user ID)
        const deletedEvents = await prisma.event.deleteMany({
            where: {
                author: {
                    telegramId: BigInt('987654321') // Replace with the actual Telegram ID of the user
                }
            }
        });

        console.log(`Deleted ${deletedEvents.count} events`);

        // Delete the user
        const deletedUser = await prisma.user.delete({
            where: {
                telegramId: BigInt('987654321') // Replace with the actual Telegram ID
            }
        });

        console.log('Deleted user:', deletedUser);
    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanup();
