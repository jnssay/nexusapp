import React, { useState, useEffect } from 'react';
import { Button } from "~/components/ui/button";
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
import { TbCirclePlus } from 'react-icons/tb';
import Link from 'next/link';
import VoteButtons from '~/app/_components/VoteButtons';

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
    status: 'PENDING' | 'CONFIRMED' | 'DELETED' | 'COMPLETED';
    author: {
        id: string;
        firstName: string;
        lastName?: string;
        username?: string;
        telegramId: string;
    };
    Idea: Idea[];
    confirmedIdea?: Idea;
}

interface IdeaBoardProps {
    event: Event;
}

const IdeaBoard: React.FC<IdeaBoardProps> = ({ event }) => {
    const { user } = useInitData();
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

    const [eventData, setEventData] = useState<Event>(event);

    const isEventAuthor = user?.id === eventData.author?.id;

    // Sort ideas only on page load
    useEffect(() => {
        const sortedIdeas = [...event.Idea].sort((a, b) => b.likes - a.likes);
        setIdeas(sortedIdeas);
    }, [event.Idea]);

    const handleConfirmIdea = async () => {
        if (!selectedIdeaId) return;
        try {
            const response = await fetch(`/api/events/${eventData.id}/confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ideaId: selectedIdeaId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to confirm idea');
            }

            const updatedEvent = await response.json();
            setEventData(updatedEvent);
            setSelectedIdeaId(null);
        } catch (error) {
            console.error(error);
            alert(`Error: ${(error as Error).message}`);
        }
    };

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
        } catch (error) {
            console.error(error);
        }
    };

    console.log("eventData:", eventData)
    console.log("eventData confirmed idea:", eventData.confirmedIdea)
    console.log("eventData status:", eventData.status)

    return (
        <div className="flex flex-col h-screen mx-auto py-6 md:p-10">
            {/* Header */}
            <header className="bg-accent text-accent-foreground border-border border rounded-md items-center justify-center flex shadow md:mx-10 mb-4 md:mb-10 ">
                <div className="w-80 md:w-full py-6 md:mx-10 flex justify-center md:justify-between items-center">
                    <div className="flex flex-col items-center md:items-start">
                        <h1 className="truncate text-3xl font-bold text-foreground">{event.name}</h1>
                        <h2 className="text-md text-foreground">by {event.author.firstName}</h2>
                    </div>
                    <div className="flex items-center md:gap-4 hidden md:flex md:ml-10">
                        {eventData.status !== 'CONFIRMED' && (
                            <Link href={`/event/${event.id}/newidea`}>
                                <Button className="border-border border bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground flex items-center">
                                    <TbCirclePlus className="mr-2 h-4 w-4" /> New Idea
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile New Idea Button */}
            <div className="flex items-center justify-end md:hidden mb-6">
                {eventData.status !== 'CONFIRMED' && (
                    <Link href={`/event/${event.id}/newidea`}>
                        <Button className="border-border border bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground  flex items-center">
                            <TbCirclePlus className="mr-2 h-4 w-4" /> New Idea
                        </Button>
                    </Link>
                )}
            </div>

            {/* Scrollable Cards Container */}
            {eventData.status === 'CONFIRMED' ? (
                <div>
                    <div className="mb-2 text-md ">Event Confirmed:</div>
                    {eventData.confirmedIdea && (
                        <Card className="border-border border bg-background text-foreground">
                            <CardHeader>
                                <CardTitle className="truncate text-lg leading-tight">
                                    {eventData.confirmedIdea.title}
                                </CardTitle>
                                <CardDescription className="truncate">
                                    By {eventData.confirmedIdea.author.firstName} {eventData.confirmedIdea.author.lastName}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">
                                    {eventData.confirmedIdea.description}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            ) : (
                <div className="flex overflow-y-auto px-4 md:px-10 custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ideas.length > 0 ? (
                            ideas.map((idea) => (
                                <Card
                                    key={idea.id}
                                    onClick={() => setSelectedIdeaId(idea.id)}
                                    className="w-72 hover:shadow-lg transition-shadow duration-300 border-border border bg-background text-foreground"
                                >
                                    <CardHeader>
                                        <CardTitle className="truncate text-lg leading-tight">
                                            {idea.title}
                                        </CardTitle>
                                        <CardDescription className="truncate">
                                            By {idea.author.firstName} {idea.author.lastName}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm line-clamp-3">
                                            {idea.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <VoteButtons
                                            ideaId={idea.id}
                                            likes={idea.likes}
                                            dislikes={idea.dislikes}
                                            userVote={idea.userVote}
                                            handleVote={handleVote}
                                        />
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full text-center">
                                <p className="text-lg text-foreground">No ideas yet. Be the first to add one!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedIdeaId && (() => {
                const idea = ideas.find((i) => i.id === selectedIdeaId);
                if (!idea) return null;

                return (
                    <Dialog open={true} onOpenChange={() => setSelectedIdeaId(null)}>
                        <DialogContent className="justify-center w-80 rounded-md border-border border bg-background text-foreground md:w-full">
                            <DialogHeader>
                                <DialogTitle className="truncate text-lg font-semibold">
                                    {idea.title}
                                </DialogTitle>
                                <DialogDescription className="truncate text-sm">
                                    By {idea.author.firstName} {idea.author.lastName}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="my-4">
                                <p className="w-72 text-sm break-all">{idea.description}</p>
                            </div>
                            <VoteButtons
                                ideaId={idea.id}
                                likes={idea.likes}
                                dislikes={idea.dislikes}
                                userVote={idea.userVote}
                                handleVote={handleVote}
                            />
                            <DialogFooter>
                                {isEventAuthor && (
                                    <Button onClick={handleConfirmIdea}>Confirm this idea!</Button>
                                )}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                );
            })()}
        </div>
    );
};

export default IdeaBoard;
