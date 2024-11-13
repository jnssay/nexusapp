
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '~/lib/supabaseClient';
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
    // Fetch event with Supabase using double-quoted table names
    const { data: event, error: eventError } = await supabase
      .from('Event')
      .select(`
        id,
        name,
        description,
        status,
        author:User(
          id,
          firstName,
          lastName,
          username
        ),
        Idea:Idea!Idea_event_id_fkey(
          id,
          title,
          description,
          likes,
          dislikes,
          createdAt,
          updatedAt,
          editedAt,
          author:User(
            id,
            firstName,
            lastName,
            username
          ),
          userVotes:UserVote(
            type
          )
        ),
        confirmedIdea:Idea!Event_confirmedIdeaId_fkey(
          id,
          title,
          author:User(
            id,
            firstName,
            lastName,
            username
          )
        )
      `)
      .eq('id', eventId)
      .maybeSingle();

    if (eventError || !event) {
      console.error('Error fetching event:', eventError);
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    // Process the ideas to match frontend interface
    const eventData = {
      id: event.id,
      name: event.name,
      description: event.description,
      status: event.status,
      confirmedIdea: event.confirmedIdea,
      author: event.author,
      Idea: event.Idea.map((idea) => {
        // Determine the user's vote for this idea
        const userVote =
          idea.userVotes?.[0]?.type === 'LIKE'
            ? 'LIKE'
            : idea.userVotes?.[0]?.type === 'DISLIKE'
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
          createdAt: idea.createdAt
            ? new Date(idea.createdAt).toISOString()
            : null,
          updatedAt: idea.updatedAt
            ? new Date(idea.updatedAt).toISOString()
            : null,
          editedAt: idea.editedAt
            ? new Date(idea.editedAt).toISOString()
            : null,
        };
      }),
    };

    // Convert BigInt values to strings if necessary
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






// import { NextRequest, NextResponse } from 'next/server';
// import prisma from '~/lib/prisma';
// import { bigIntToString } from '~/lib/bigIntToString';

// export async function GET(
//     req: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     const eventId = params.id;

//     // Get userId from query parameters
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get('userId');

//     try {
//         // Fetch the event, including ideas, user votes for the specified user, and the confirmed idea
//         const event = await prisma.event.findUnique({
//             where: { id: eventId },
//             include: {
//                 author: true,
//                 Idea: {
//                     include: {
//                         author: true,
//                         userVotes: {
//                             where: {
//                                 userId: userId || undefined, // Include userVotes for this user
//                             },
//                         },
//                     },
//                 },
//                 // Include event status and confirmed idea details
//                 Idea_Event_confirmedIdeaIdToIdea: {  // Fetch the confirmed idea relation
//                     include: {
//                         author: true, // Include the author details of the confirmed idea
//                     },
//                 },
//             },
//         });

//         if (!event) {
//             return NextResponse.json({ message: 'Event not found' }, { status: 404 });
//         }

//         // Map the data to match the frontend interface and include userVote
//         const eventData = {
//             id: event.id,
//             name: event.name,
//             description: event.description,
//             status: event.status, // Include the event status
//             confirmedIdea: event.Idea_Event_confirmedIdeaIdToIdea, // Include the full confirmed idea details
//             author: event.author,
//             Idea: event.Idea.map((idea) => {
//                 // Determine the user's vote for this idea
//                 const userVote =
//                     idea.userVotes[0]?.type === 'LIKE'
//                         ? 'LIKE'
//                         : idea.userVotes[0]?.type === 'DISLIKE'
//                             ? 'DISLIKE'
//                             : null;

//                 return {
//                     id: idea.id,
//                     title: idea.title,
//                     description: idea.description,
//                     likes: idea.likes,
//                     dislikes: idea.dislikes,
//                     author: idea.author,
//                     userVote,
//                     createdAt: idea.createdAt ? new Date(idea.createdAt).toISOString() : null,
//                     updatedAt: idea.updatedAt ? new Date(idea.updatedAt).toISOString() : null,
//                     editedAt: idea.editedAt ? new Date(idea.editedAt).toISOString() : null,

//                 };
//             }),
//         };

//         // Convert BigInt values to strings
//         const serializedEventData = bigIntToString(eventData);

//         return NextResponse.json(serializedEventData);
//     } catch (error) {
//         console.error('Error fetching event:', error);
//         return NextResponse.json(
//             { message: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }
