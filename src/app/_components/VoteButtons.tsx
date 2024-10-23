import React, { useState, useEffect } from 'react';
import { TbThumbUpFilled, TbThumbDownFilled } from 'react-icons/tb';

interface VoteButtonsProps {
    ideaId: string;
    likes: number;
    dislikes: number;
    userVote: 'LIKE' | 'DISLIKE' | null;
    handleVote: (ideaId: string, voteType: 'LIKE' | 'DISLIKE') => void;
    className?: string;
    readOnly?: boolean;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
    ideaId,
    likes,
    dislikes,
    userVote,
    handleVote,
    className = '',
    readOnly = false,
}) => {
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // Detect if the device is a touch device
    useEffect(() => {
        const checkTouchDevice = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkTouchDevice();
    }, []);

    return (
        <div className={`flex w-full items-center ${readOnly ? 'justify-end' : 'justify-between'} ${className}`}>
            <button
                onClick={(e) => {
                    if (readOnly) return; // Disable click if read-only
                    e.stopPropagation();
                    handleVote(ideaId, 'LIKE');
                }}
                className={`flex items-center px-2 py-1 rounded border-box ${userVote === 'LIKE'
                    ? 'border border-green-600 text-green-600'
                    : 'border border-transparent text-primary'
                    } ${!isTouchDevice && !readOnly ? 'hover:text-green-600' : ''}`} // Disable hover when read-only
                aria-label="Upvote Idea"
                style={{ boxSizing: 'border-box', minHeight: '36px', outline: 'none' }}
                disabled={readOnly} // Disable button when read-only
            >
                <TbThumbUpFilled className="mr-1" />
                {likes}
            </button>

            <button
                onClick={(e) => {
                    if (readOnly) return; // Disable click if read-only
                    e.stopPropagation();
                    handleVote(ideaId, 'DISLIKE');
                }}
                className={`flex items-center px-2 py-1 rounded border-box ${userVote === 'DISLIKE'
                    ? 'border border-red-600 text-red-600'
                    : 'border border-transparent text-primary'
                    } ${!isTouchDevice && !readOnly ? 'hover:text-red-600' : ''}`} // Disable hover when read-only
                aria-label="Downvote Idea"
                style={{ boxSizing: 'border-box', minHeight: '36px', outline: 'none' }}
                disabled={readOnly} // Disable button when read-only
            >
                <TbThumbDownFilled className="mr-1" />
                {dislikes}
            </button>
        </div>
    );
};

export default VoteButtons;
