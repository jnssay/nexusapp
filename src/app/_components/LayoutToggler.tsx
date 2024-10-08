"use client "


import { useState, useEffect } from 'react';
import { GridIcon, ListBulletIcon } from '@radix-ui/react-icons';
import { cn } from '~/lib/utils';

const layoutOptions = [
    {
        name: 'Compact',
        columns: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
        gap: 'gap-2',
    },
    {
        name: 'Standard',
        columns: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        gap: 'gap-4',
    },
    {
        name: 'Comfortable',
        columns: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3',
        gap: 'gap-6',
    },
];

interface LayoutOption {
    name: string;
    columns: string;
    gap: string;
}

interface LayoutTogglerProps {
    layout: LayoutOption;
    setLayout: (layout: LayoutOption) => void;
}

export function LayoutToggler({ layout, setLayout }: LayoutTogglerProps) {
    return (
        <div className="flex space-x-2">
            {layoutOptions.map((option) => (
                <button
                    key={option.name}
                    onClick={() => setLayout(option)}
                    className={`px-3 py-1 rounded-md text-sm font-medium focus:outline-none ${layout.name === option.name
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    {option.name}
                </button>
            ))}
        </div>
    );
}