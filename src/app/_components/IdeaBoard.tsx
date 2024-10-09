import React, { useEffect, useState } from 'react';

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

interface IdeaBoardProps {
    event: Event;
}

const IdeaBoard: React.FC<IdeaBoardProps> = ({ event }) => {
    const [ideas, setIdeas] = useState<Idea[]>(event.ideas);

    const handleUpvote = async (id: string): Promise<void> => {
        // Implement upvote logic
    };

    const handleDownvote = async (id: string): Promise<void> => {
        // Implement downvote logic
    };

    return (
        <div className="flex flex-col h-screen mx-auto p-6 md:p-10">
            <header className="bg-secondary items-center justify-center flex shadow md:mx-10 mb-4 md:mb-10 ">
                <div className="w-72 md:w-full px-10 py-6 flex justify-center md:justify-between items-center">
                    <div className="flex flex-col items-center md:items-start">
                        <h1 className="truncate text-3xl font-bold text-foreground">{event.name}</h1>
                        <h2 className="text-md text-foreground">by {event.author.firstName}</h2>
                    </div>
                </div>
            </header>

            <div className="flex overflow-y-auto px-4 md:px-10 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {ideas.length > 0 ? (
                        ideas.map((idea) => (
                            <div key={idea.id} className="bg-card text-card-foreground">
                                <h3>{idea.title}</h3>
                                <p>By {idea.author.firstName} {idea.author.lastName}</p>
                                <p>{idea.description}</p>
                                <button onClick={() => handleUpvote(idea.id)}>Like ({idea.likes})</button>
                                <button onClick={() => handleDownvote(idea.id)}>Dislike ({idea.dislikes})</button>
                            </div>
                        ))
                    ) : (
                        <p>No ideas yet. Be the first to add one!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IdeaBoard;
