"use client"

// ThemeToggler.tsx
import { useState, useEffect } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FaCircle } from "react-icons/fa";
import { cn } from '~/lib/utils'; // Adjust the path according to your project structure

const themes = [
    { name: 'Default', value: 'default' },
    { name: 'Ness Theme', value: 'pink' },
    { name: 'Blue', value: 'blue' },
    { name: 'Dark', value: 'dark' },
];

export function ThemeToggler() {
    const [theme, setTheme] = useState('default');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'default';
        setTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);

    const applyTheme = (themeValue: string) => {
        const root = document.documentElement;

        // Remove previous theme classes/attributes
        root.classList.remove('dark');
        themes.forEach((t) => root.removeAttribute('data-theme'));

        // Apply new theme
        if (themeValue === 'dark') {
            root.classList.add('dark');
        } else if (themeValue !== 'default') {
            root.setAttribute('data-theme', themeValue);
        }

        // Save to localStorage
        localStorage.setItem('theme', themeValue);
    };

    const changeTheme = (themeValue: string) => {
        setTheme(themeValue);
        applyTheme(themeValue);
    };



    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    className="rounded-md p-2 focus:outline-none"
                    aria-label="Change Theme"
                >
                    <FaCircle className="w-8 h-8 text-primary hover:text-primary" />
                </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
                sideOffset={5}
                className={cn(
                    'w-40 rounded-md bg-white p-1 shadow-md dark:bg-gray-800',
                    'ring-1 ring-black ring-opacity-5 focus:outline-none'
                )}
            >
                {themes.map((t) => (
                    <DropdownMenu.Item
                        key={t.value}
                        onSelect={() => changeTheme(t.value)}
                        className={cn(
                            'flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-200',
                            'hover:bg-gray-100 dark:hover:bg-gray-700',
                            theme === t.value && 'font-semibold'
                        )}
                    >
                        {t.name}
                    </DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}
