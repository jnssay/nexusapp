"use client";

import React from 'react';
import { useInitData } from '~/telegram/InitDataContext';

const DisplayInitData: React.FC = () => {
    const { initData } = useInitData(); // Access context

    // Function to render the value appropriately
    const renderValue = (key: string, value: any): React.ReactNode => {
        // Check if key is "user" and value is an object
        if (key === "user" && typeof value === "object" && value !== null) {
            // Convert the object to an array of key-value pairs for display
            return (
                <div className="p-2 border border-gray-300 rounded-md bg-gray-50">
                    {Object.entries(value).map(([userKey, userValue]) => (
                        <div key={userKey}>
                            <strong>{userKey}:</strong> {String(userValue)} {/* Ensure userValue is a string */}
                        </div>
                    ))}
                </div>
            );
        }
        // For other values, display them directly
        return <span>{String(value)}</span>; // Ensure value is a string
    };

    return (
        <div>
            {!initData ? ( // Show loading message if initData is null
                <p>Loading Init Data...</p>
            ) : (
                <>
                    <h2 className="text-xl font-bold border-b mt-10 mb-4">Telegram Init Data:</h2>
                    <div className="w-72 truncate">
                        {Object.entries(initData).map(([key, value]) => (
                            <div key={key}>
                                <strong>{key}:</strong> {renderValue(key, value)}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default DisplayInitData;
