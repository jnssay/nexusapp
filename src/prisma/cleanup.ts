import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
    try {
        // Delete ideas created by the user
        const deletedIdeas = await prisma.idea.deleteMany({
            where: {
                author: {
                    telegramId: BigInt('987654321') // Replace with the actual Telegram ID of the user
                }
            }
        });

        console.log(`Deleted ${deletedIdeas.count} ideas`);

        // Delete events related to the user
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
