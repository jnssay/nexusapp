"use client";

import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '~/components/ui/card';
import { TbThumbUpFilled, TbThumbDownFilled } from 'react-icons/tb';

interface Idea {
    id: string;
    title: string;
    author: {
        firstName: string;
        lastName?: string;
        username?: string;
        telegramId: string;
    };
    description?: string;
    likes: number;
    dislikes: number;
    userVote: 'like' | 'dislike' | null;
}

interface Event {
    id: string;
    name: string;
    description?: string;
    author: {
        firstName: string;
        lastName?: string;
        username?: string;
        telegramId: string;
    };
    ideas: Idea[];
}


const IdeaBoard: React.FC = () => {
    const [event, setEvent] = useState<Event | null>(null);
    const eventId = 'cm1rdnq5w000113b4h73ch4jf'; // Replace with the actual event ID

    // Fetch event data from the API
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`/api/events/${eventId}`);
                const data = await response.json();
                setEvent(data);
            } catch (error) {
                console.error('Error fetching event:', error);
            }
        };

        fetchEvent();
    }, [eventId]);

    // Handlers remain the same
    const handleUpvote = async (id: string): Promise<void> => {
        // Implement upvote logic here, including API call to update the database
    };

    const handleDownvote = async (id: string): Promise<void> => {
        // Implement downvote logic here, including API call to update the database
    };

    if (!event) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-5xl font-bold mb-6 text-center w-full">
                {event.name}
            </h1>
            <h2 className="text-xl mb-20 text-center w-full">
                by {event.author.firstName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {event.ideas.map((idea) => (
                    <Card
                        key={idea.id}
                        className="hover:shadow-lg transition-shadow duration-300 bg-secondary"
                    >
                        <CardHeader>
                            <CardTitle>{idea.title}</CardTitle>
                            <CardDescription>
                                By {idea.author.firstName} {idea.author.lastName}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {idea.description}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <div className="flex items-center justify-between w-full">
                                <button
                                    onClick={() => handleUpvote(idea.id)}
                                    className={`flex items-center ${idea.userVote === 'like'
                                        ? 'text-green-600'
                                        : 'text-gray-500 hover:text-green-600'
                                        }`}
                                >
                                    <TbThumbUpFilled className="mr-1" />
                                    {idea.likes}
                                </button>
                                <button
                                    onClick={() => handleDownvote(idea.id)}
                                    className={`flex items-center ${idea.userVote === 'dislike'
                                        ? 'text-red-600'
                                        : 'text-gray-500 hover:text-red-600'
                                        }`}
                                >
                                    <TbThumbDownFilled className="mr-1" />
                                    {idea.dislikes}
                                </button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default IdeaBoard;
