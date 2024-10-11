import React, { useState, useEffect } from 'react';
import { Button } from "~/components/ui/button"
import { useInitData } from '~/telegram/InitDataContext';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '~/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '~/components/ui/dialog';

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
    userVote: 'LIKE' | 'DISLIKE' | null;
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
    const { user } = useInitData();
    const [ideas, setIdeas] = useState<Idea[]>(event.Idea);
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

    const sortedIdeas = [...ideas].sort((a, b) => b.likes - a.likes);

    const handleVote = async (ideaId: string, voteType: 'LIKE' | 'DISLIKE') => {
        try {
            const idea = ideas.find((i) => i.id === ideaId);
            if (!idea) return;

            let newVoteType: 'LIKE' | 'DISLIKE' | null;
            if (idea.userVote === voteType) {
                // User is removing their vote
                newVoteType = null;
            } else {
                // User is casting a new vote or switching vote
                newVoteType = voteType;
            }

            const userId = user?.id;

            if (!userId) {
                console.error('User is not logged in');
                return;
            }

            // Optimistically update the state based on the user's action
            setIdeas((prevIdeas) =>
                prevIdeas.map((i) => {
                    if (i.id === ideaId) {
                        let likes = i.likes;
                        let dislikes = i.dislikes;
                        const previousVote = i.userVote;

                        // Remove previous vote
                        if (previousVote === 'LIKE') {
                            likes -= 1;
                        } else if (previousVote === 'DISLIKE') {
                            dislikes -= 1;
                        }

                        // Add new vote
                        if (newVoteType === 'LIKE') {
                            likes += 1;
                        } else if (newVoteType === 'DISLIKE') {
                            dislikes += 1;
                        }

                        return { ...i, likes, dislikes, userVote: newVoteType };
                    }
                    return i;
                })
            );

            // Send the vote to the backend
            const response = await fetch(`/api/idea/${ideaId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ voteType: newVoteType, userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to vote');
            }

            // Optionally handle the server response if needed
            // Since we don't want to include other users' votes, we ignore the server's updated counts
        } catch (error) {
            console.error(error);
            // Optionally revert the optimistic update or show an error
        }
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
                    {sortedIdeas.length > 0 ? (
                        sortedIdeas.map((idea) => (
                            <Card
                                key={idea.id}
                                onClick={() => setSelectedIdea(idea)}
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleVote(idea.id, 'LIKE');
                                            }}
                                            className={`flex items-center px-2 py-1 rounded ${idea.userVote === 'LIKE'
                                                ? 'border border-green-600 text-green-600'
                                                : 'text-gray-500 hover:text-green-600'
                                                }`}
                                            aria-label="Upvote Idea"
                                        >
                                            <TbThumbUpFilled className="mr-1" />
                                            {idea.likes}
                                        </button>

                                        {/* Downvote Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleVote(idea.id, 'DISLIKE');
                                            }}
                                            className={`flex items-center px-2 py-1 rounded ${idea.userVote === 'DISLIKE'
                                                ? 'border border-red-600 text-red-600'
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


                    <Dialog open={selectedIdea !== null} onOpenChange={() => setSelectedIdea(null)}>
                        <DialogContent className="w-80 md:w-full">
                            <DialogHeader>
                                <DialogTitle>{selectedIdea?.title}</DialogTitle>
                                <DialogDescription>
                                    By {selectedIdea?.author.firstName} {selectedIdea?.author.lastName}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="my-4">
                                {selectedIdea?.description}
                            </div>
                            <DialogFooter>
                                <Button>Confirm this idea!</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>



                </div>
            </div>
        </div>
    );
};

export default IdeaBoard;