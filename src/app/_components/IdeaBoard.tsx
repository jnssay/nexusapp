import React, { useState, useEffect } from 'react';
import { Button } from "~/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '~/components/ui/card';
import { TbThumbUpFilled, TbThumbDownFilled, TbCirclePlus } from 'react-icons/tb';
import { ThemeToggler } from './ThemeToggler';
import Link from 'next/link';

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
    Idea: Idea[];
}

interface IdeaBoardProps {
    event: Event;
}

const IdeaBoard: React.FC<IdeaBoardProps> = ({ event }) => {
    const [ideas, setIdeas] = useState<Idea[]>(event.Idea);

    const handleUpvote = async (id: string): Promise<void> => {
        // Implement upvote logic
    };

    const handleDownvote = async (id: string): Promise<void> => {
        // Implement downvote logic
    };

    return (
        <div className="flex flex-col h-screen mx-auto p-6 md:p-10">
            {/* Header */}
            <header className="bg-secondary items-center justify-center flex shadow md:mx-10 mb-4 md:mb-10 ">
                <div className="w-72 md:w-full px-10 py-6 flex justify-center md:justify-between items-center">
                    <div className="flex flex-col items-center md:items-start">
                        <h1 className="truncate text-3xl font-bold text-foreground">{event.name}</h1>
                        <h2 className="text-md text-foreground">by {event.author.firstName}</h2>
                    </div>
                    <div className="flex items-center md:gap-4 hidden md:flex md:ml-10">
                        <Link href={`/event/${event.id}/newidea`}>

                            <Button className="bg-primary text-primary-foreground flex items-center">
                                <TbCirclePlus className="mr-2 h-4 w-4" /> New Idea
                            </Button>
                        </Link>

                        <ThemeToggler />
                    </div>
                </div>
            </header>

            {/* Mobile New Idea Button */}
            <div className="flex items-center justify-end md:hidden mb-6">
                <Link href={`/event/${event.id}/newidea`}>
                    <Button className="bg-primary text-primary-foreground flex items-center">
                        <TbCirclePlus className="mr-2 h-4 w-4" /> New Idea
                    </Button>
                </Link>
            </div>

            {/* Scrollable Cards Container */}
            <div className="flex overflow-y-auto px-4 md:px-10 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {ideas.length > 0 ? (
                        ideas.map((idea) => (
                            <Card
                                key={idea.id}
                                className="hover:shadow-lg transition-shadow duration-300 bg-card text-card-foreground"
                            >
                                <CardHeader>
                                    <CardTitle className="truncate text-lg leading-tight">
                                        {idea.title}
                                    </CardTitle>
                                    <CardDescription className="truncate text-card-foreground">
                                        By {idea.author.firstName} {idea.author.lastName}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-card-foreground line-clamp-3">
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
                                            aria-label="Upvote Idea"
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
                                            aria-label="Downvote Idea"
                                        >
                                            <TbThumbDownFilled className="mr-1" />
                                            {idea.dislikes}
                                        </button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center">
                            <p className="text-lg text-gray-500">No ideas yet. Be the first to add one!</p>
                        </div>
                    )}



                </div>
            </div>
        </div>
    );
};

export default IdeaBoard;