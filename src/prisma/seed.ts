import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    // Adding ideas for the event
    const idea1 = await prisma.idea.create({
        data: {
            title: 'Refreshments During Book Club',
            description: `How about we have some refreshments while discussing our books? 
                I can bring my homemade iced tea – it’s really refreshing, especially with a little bit of mint. 
                We could also do light snacks, maybe some fruit platters or cheese. I think this would make our sessions more enjoyable and help everyone stay energized. 
                We’d just need someone to coordinate what snacks everyone can bring, and maybe someone can bring disposable cups and napkins.`,
            event_id: event1.id,
            userId: user.id,
        },
    });

    const idea2 = await prisma.idea.create({
        data: {
            title: 'Outdoor Book Club Meeting',
            description: `Let’s consider hosting the book club outdoors for one of our meetings. 
                We could meet at the local park, and everyone can bring a blanket or chair to sit on. 
                It could be a really relaxing setting – we’d just need to make sure we pick a weekend with good weather. 
                Maybe we could even do a picnic-style meeting, where everyone brings some food to share. Logistics-wise, we might need to confirm the space is available and figure out if there’s enough shade, 
                but I think it would add a great atmosphere to our discussions!`,
            event_id: event1.id,
            userId: user.id,
        },
    });

    console.log('Seeded ideas:', { idea1, idea2 });

    // Save the event ID to a JSON file
    const eventIdFilePath = path.join(__dirname, 'seededEventData.json');
    fs.writeFileSync(eventIdFilePath, JSON.stringify({ eventId: event1.id }, null, 2));

    console.log(`Event ID ${event1.id} written to seededEventData.json`);

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