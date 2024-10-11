import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// Define the GET handler for the API route
export async function GET() {
    try {
        // Construct the path to the seededEventData.json file
        const filePath = path.join(process.cwd(), 'src/prisma', 'seededEventData.json'); // Adjust the path as needed

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Seeded event data not found' }, { status: 404 });
        }

        // Read the content of the file
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { eventId } = JSON.parse(fileContent);

        // Return the event ID in the response
        return NextResponse.json({ eventId });
    } catch (error) {
        console.error('Failed to read the seeded event data:', error);
        return NextResponse.json({ error: 'Failed to load the event ID' }, { status: 500 });
    }
}
