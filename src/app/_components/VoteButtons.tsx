// components/VoteButtons.tsx

import React from 'react';
import { TbThumbUpFilled, TbThumbDownFilled } from 'react-icons/tb';

interface VoteButtonsProps {
    ideaId: string;
    likes: number;
    dislikes: number;
    userVote: 'LIKE' | 'DISLIKE' | null;
    handleVote: (ideaId: string, voteType: 'LIKE' | 'DISLIKE') => void;
    className?: string;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
    ideaId,
    likes,
    dislikes,
    userVote,
    handleVote,
    className = '',
}) => {
    return (
        <div className={`flex w-full items-center justify-between ${className}`}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote(ideaId, 'LIKE');
                }}
                className={`flex items-center px-2 py-1 rounded ${userVote === 'LIKE'
                    ? 'border border-green-600 text-green-600'
                    : 'text-gray-500 hover:text-green-600'
                    }`}
                aria-label="Upvote Idea"
            >
                <TbThumbUpFilled className="mr-1" />
                {likes}
            </button>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote(ideaId, 'DISLIKE');
                }}
                className={`flex items-center px-2 py-1 rounded ${userVote === 'DISLIKE'
                    ? 'border border-red-600 text-red-600'
                    : 'text-gray-500 hover:text-red-600'
                    }`}
                aria-label="Downvote Idea"
            >
                <TbThumbDownFilled className="mr-1" />
                {dislikes}
            </button>
        </div>
    );
};

export default VoteButtons;
