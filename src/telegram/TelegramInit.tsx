"use client"

import { useEffect, useState } from "react";
import Script from 'next/script';
import { useInitData } from '~/telegram/InitDataContext'; // Adjust path as necessary

const TelegramInit: React.FC = () => {
    const { setInitData, setUser } = useInitData(); // Added setUser from context
    const [isSdkLoaded, setIsSdkLoaded] = useState(false);

    useEffect(() => {
        const checkTelegram = async () => {
            if (typeof window !== "undefined" && window.Telegram) {
                window.Telegram.WebApp.ready();

                const initData = window.Telegram.WebApp.initData;
                const parsedData = parseInitData(initData);

                // Check or create the user in the database
                const user = await checkOrCreateUser(parsedData);

                setInitData(parsedData); // Save initData in context
                setUser(user); // Save user in context
            }
        };

        if (isSdkLoaded) {
            checkTelegram();
        }
    }, [isSdkLoaded, setInitData, setUser]);

    return (
        <>
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy="afterInteractive"
                onLoad={() => setIsSdkLoaded(true)}
            />
        </>
    );
};

// Function to parse initData
const parseInitData = (initData: string) => {
    const params = new URLSearchParams(initData);
    const parsedData: Record<string, any> = {};

    for (const [key, value] of params.entries()) {
        parsedData[key] = decodeURIComponent(value);
    }

    // Parse the user data if it's a JSON string
    if (parsedData.user) {
        try {
            parsedData.user = JSON.parse(parsedData.user);
        } catch (error) {
            console.error("Error parsing user data:", error);
        }
    }

    return parsedData;
};

// Function to check or create user in database
const checkOrCreateUser = async (telegramUserData: Record<string, any>) => {
    try {
        const userData = telegramUserData.user;

        console.log("Sending to API:", userData); // Log the parsed user data

        const response = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: userData.id,
                firstName: userData.first_name,  // Adjust to match parsed user keys
                lastName: userData.last_name,    // Adjust to match parsed user keys
                username: userData.username,     // This may be optional if not provided
            }),
        });

        if (response.ok) {
            const user = await response.json();
            console.log("User created/checked:", user); // Log the response
            return user;
        } else {
            console.error("Error checking/creating user:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

export default TelegramInit;
