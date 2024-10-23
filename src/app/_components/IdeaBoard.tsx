import React, { useState, useEffect } from 'react';
import { Button } from "~/components/ui/button";
import { useInitData } from '~/telegram/InitDataContext';
import { MdMoreVert, MdEditSquare } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { formatDistanceToNow } from 'date-fns';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
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
    createdAt: string;
    updatedAt?: string;
    editedAt?: string;
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
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [ideaToDelete, setIdeaToDelete] = useState<Idea | null>(null);
    const [eventData, setEventData] = useState<Event>(event);
    const [ideaToEdit, setIdeaToEdit] = useState<Idea | null>(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);

    const isEventAuthor = user?.id === eventData.author?.id;

    useEffect(() => {
        const sortedIdeas = [...event.Idea].sort((a, b) => b.likes - a.likes);
        setIdeas(sortedIdeas);
    }, [event.Idea]);

    // Function to handle canceling the edit
    const handleCancelEdit = () => {
        if (editedDescription !== (ideaToEdit?.description || '')) {
            // Unsaved changes detected
            setShowConfirmDiscard(true);
        } else {
            // No unsaved changes, close the edit dialog
            setIdeaToEdit(null);
        }
    };

    // Function to confirm discarding changes
    const confirmDiscardChanges = () => {
        setShowConfirmDiscard(false);
        setEditedDescription('');
        setIdeaToEdit(null);
    };

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
            setShowConfirmationDialog(false);
        } catch (error) {
            console.error(error);
            alert(`Error: ${(error as Error).message}`);
        }
    };

    const handleVote = async (ideaId: string, voteType: 'LIKE' | 'DISLIKE') => {
        try {
            const idea = ideas.find((i) => i.id === ideaId);
            if (!idea || !user) return;

            let newVoteType: 'LIKE' | 'DISLIKE' | null;
            if (idea.userVote === voteType) {
                newVoteType = null; // User is removing their vote
            } else {
                newVoteType = voteType; // User is changing or adding a vote
            }

            // Optimistically update the UI
            setIdeas((prevIdeas) =>
                prevIdeas.map((i) => {
                    if (i.id === ideaId) {
                        let likes = i.likes;
                        let dislikes = i.dislikes;
                        const previousVote = i.userVote;

                        // Adjust counts based on previous and new votes
                        if (previousVote === 'LIKE') {
                            likes -= 1;
                        } else if (previousVote === 'DISLIKE') {
                            dislikes -= 1;
                        }

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
                body: JSON.stringify({ voteType: newVoteType, userId: user.id }),
            });

            if (!response.ok) {
                // If the vote failed, revert the optimistic update
                setIdeas((prevIdeas) => prevIdeas.map((i) => (i.id === ideaId ? idea : i)));
                throw new Error('Failed to vote');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const openConfirmationDialog = (ideaId: string) => {
        setSelectedIdeaId(ideaId);
        setShowConfirmationDialog(true);
    };

    const closeConfirmationDialog = () => {
        setShowConfirmationDialog(false);
        setSelectedIdeaId(null);
    };

    const handleDeleteIdea = (idea: Idea) => {
        setIdeaToDelete(idea);
    };

    const confirmDeleteIdea = async () => {
        if (!ideaToDelete) return;

        try {
            const response = await fetch(`/api/idea/${ideaToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete idea');
            }

            setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== ideaToDelete.id));
            setSelectedIdeaId(null);
            setIdeaToDelete(null);
        } catch (error) {
            console.error(error);
            alert(`Error: ${(error as Error).message}`);
        }
    };

    const handleEditIdea = (idea: Idea) => {
        setIdeaToEdit(idea);
        setEditedTitle(idea.title);
        setEditedDescription(idea.description || "");
    };

    const confirmEditIdea = async () => {
        if (!ideaToEdit || !user) return;

        try {
            const response = await fetch(`/api/idea/${ideaToEdit.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description: editedDescription,
                    userId: user.id, // Include userId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to edit idea');
            }

            const updatedIdea = await response.json();
            setIdeas((prevIdeas) =>
                prevIdeas.map((idea) => (idea.id === updatedIdea.id ? updatedIdea : idea))
            );
            setIdeaToEdit(null);
        } catch (error) {
            console.error(error);
            alert(`Error: ${(error as Error).message}`);
        }
    };

    return (
        <div className="flex flex-col h-screen mx-auto py-6 md:p-10">
            {/* Header */}
            <header className="bg-accent text-accent-foreground border-border border rounded-md items-center justify-center flex shadow md:mx-10 md:mb-10 ">
                <div className="w-80 md:w-full py-6 md:mx-10 flex justify-center md:justify-between items-center">
                    <div className="flex flex-col items-center md:items-start">
                        <h1 className="text-xl font-bold text-foreground text-center line-clamp-2 overflow-hidden break-all px-4 md:px-0">
                            {event.name}
                        </h1>
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
                        <Button className="mt-4 border-border border bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground  flex items-center">
                            <TbCirclePlus className="mr-2 h-4 w-4" /> New Idea
                        </Button>
                    </Link>
                )}
            </div>

            {/* Scrollable Cards Container */}
            {eventData.status === 'CONFIRMED' ? (
                <div className="flex flex-col md:px-10 text-foreground items-center justify-start">
                    <div className="mb-2 text-md ">Confirmed:</div>
                    {eventData.confirmedIdea && (
                        <Card className="w-80 hover:shadow-lg transition-shadow duration-300 border-border border bg-background text-foreground">
                            <CardHeader>
                                <CardTitle className="truncate text-lg leading-tight">
                                    {eventData.confirmedIdea.title}
                                </CardTitle>
                                <CardDescription className="truncate">
                                    By {eventData.confirmedIdea.author.firstName}{' '}
                                    {eventData.confirmedIdea.author.lastName}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="h-48 text-sm overflow-y-auto custom-scrollbar">
                                    {eventData.confirmedIdea.description}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <VoteButtons
                                    ideaId={eventData.confirmedIdea.id}
                                    likes={eventData.confirmedIdea.likes}
                                    dislikes={eventData.confirmedIdea.dislikes}
                                    userVote={eventData.confirmedIdea.userVote}
                                    handleVote={() => { }}
                                    readOnly
                                />
                            </CardFooter>
                        </Card>
                    )}
                </div>
            ) : (
                <div className="flex overflow-y-auto justify-center md:px-10 custom-scrollbar">
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
                                            <span className="ml-2 text-xs">
                                                {idea.editedAt
                                                    ? `Edited ${formatDistanceToNow(new Date(idea.editedAt), { addSuffix: true })}`
                                                    : `${formatDistanceToNow(new Date(idea.createdAt))} ago`
                                                }
                                            </span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm line-clamp-3">{idea.description}</p>
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
                                <p className="text-lg text-foreground">
                                    No ideas yet. Be the first to add one!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Idea Details Dialog */}
            {selectedIdeaId && (() => {
                const idea = ideas.find((i) => i.id === selectedIdeaId);
                if (!idea) return null;

                const isIdeaAuthor = user?.telegramId === idea.author.telegramId; // Check if user is idea author

                return (
                    <Dialog open={true} onOpenChange={() => setSelectedIdeaId(null)}>
                        <DialogContent className="justify-center max-h-screen w-80 rounded-md border-border border bg-background text-foreground md:w-full">
                            <DialogHeader>

                                <div className="flex flex-row justify-between items-center">
                                    <DialogTitle className="px-1 text-start w-full text-lg font-semibold break-all line-clamp-2 overflow-hidden">
                                        {idea.title}
                                    </DialogTitle>
                                    {isIdeaAuthor && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="focus:outline-none">
                                                    <MdMoreVert className="text-primary w-6 h-6 cursor-pointer focus:outline-none" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side="bottom" align="end" className="w-40 bg-background border-border text-foreground">
                                                <DropdownMenuItem
                                                    onClick={() => handleEditIdea(idea)}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                >
                                                    <MdEditSquare className="w-5 h-5" />
                                                    <span>Edit</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteIdea(idea)}
                                                    className="flex items-center gap-2 cursor-pointer text-red-600"
                                                >
                                                    <RiDeleteBin5Fill className="w-5 h-5" />
                                                    <span >Delete</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}

                                </div>
                                <DialogDescription className="text-start text-sm px-1">
                                    By {idea.author.firstName} {idea.author.lastName}
                                    <span className="ml-2 text-xs">
                                        {idea.editedAt
                                            ? `Edited ${formatDistanceToNow(new Date(idea.editedAt), { addSuffix: true })}`
                                            : `${formatDistanceToNow(new Date(idea.createdAt))} ago`
                                        }
                                    </span>
                                </DialogDescription>


                            </DialogHeader>
                            <p className="w-72 h-60 px-1 text-sm break-all overflow-y-auto">
                                {idea.description}
                            </p>
                            <div className="flex flex-row items-center">
                                <VoteButtons
                                    ideaId={idea.id}
                                    likes={idea.likes}
                                    dislikes={idea.dislikes}
                                    userVote={idea.userVote}
                                    handleVote={handleVote}
                                />
                            </div>
                            <DialogFooter>
                                {isEventAuthor && (
                                    <Button variant="default"
                                        onClick={() => openConfirmationDialog(idea.id)}
                                    >
                                        Confirm this idea!
                                    </Button>
                                )}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                );
            })()}

            {/* Confirmation Dialog for Event Confirmation */}
            {showConfirmationDialog && (
                <Dialog open={showConfirmationDialog} onOpenChange={closeConfirmationDialog}>
                    <DialogContent className="w-72 mx-auto bg-background border-border border rounded-md text-foreground">
                        <DialogHeader>
                            <DialogTitle className="mb-2">Choose this idea?</DialogTitle>
                            <DialogDescription>
                                We will let the group chat know about your decision!
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-y-2">
                            <Button variant="muted" onClick={closeConfirmationDialog}>
                                Cancel
                            </Button>
                            <Button variant="default" onClick={handleConfirmIdea}>
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Confirmation Dialog for Idea Deletion */}
            {ideaToDelete && (
                <Dialog open={true} onOpenChange={() => setIdeaToDelete(null)}>
                    <DialogContent className="w-72 mx-auto bg-background border-border border rounded-md text-foreground">
                        <DialogHeader>
                            <DialogTitle>Delete Idea</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this idea? This action cannot be
                                undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-y-2">
                            <Button variant="muted" onClick={() => setIdeaToDelete(null)}>
                                Cancel
                            </Button>
                            <Button variant="default" onClick={confirmDeleteIdea}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Edit Idea Dialog */}
            {ideaToEdit && (
                <Dialog open={true} onOpenChange={() => setIdeaToEdit(null)}>
                    <DialogContent className="w-80 mx-auto bg-background border-border border rounded-md text-foreground">

                        <div>
                            <h2 className="truncate text-lg leading-tight font-bold mb-2">
                                {ideaToEdit.title}
                            </h2>
                            <textarea
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                className="w-full p-2 border rounded bg-background border-border focus:outline-none"
                                placeholder="Edit Description"
                                rows={10}
                            />
                        </div>
                        <DialogFooter className="gap-y-2">
                            <Button variant="muted" onClick={handleCancelEdit}>
                                Cancel
                            </Button>
                            <Button variant="default" onClick={confirmEditIdea}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )
            }

            {showConfirmDiscard && (
                <Dialog open={true} onOpenChange={() => setShowConfirmDiscard(false)}>
                    <DialogContent className="w-80 mx-auto bg-background border-border border rounded-md text-foreground">
                        <DialogHeader>
                            <DialogTitle>Discard Changes?</DialogTitle>
                        </DialogHeader>
                        <div className="mb-4">
                            <p>Are you sure you want to discard your changes?</p>
                        </div>
                        <DialogFooter className="gap-y-2">
                            <Button variant="muted" onClick={() => setShowConfirmDiscard(false)}>
                                Cancel
                            </Button>
                            <Button variant="default" onClick={confirmDiscardChanges}>
                                Discard Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div >
    );
};

export default IdeaBoard;
