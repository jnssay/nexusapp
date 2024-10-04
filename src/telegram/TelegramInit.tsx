"use client";

import { useEffect, useState } from "react";
import Script from 'next/script';
import { useInitData } from '~/telegram/InitDataContext'; // Adjust path as necessary

const TelegramInit: React.FC = () => {
    const { setInitData } = useInitData();
    const [isSdkLoaded, setIsSdkLoaded] = useState(false); // State to track SDK loading

    useEffect(() => {
        const checkTelegram = () => {
            if (typeof window !== "undefined" && window.Telegram) {
                console.log("Telegram SDK is available"); // Log if Telegram is accessible

                window.Telegram.WebApp.ready();

                // Retrieve init data
                const initData = window.Telegram.WebApp.initData;
                console.log("Telegram Init Data:", initData); // Log the raw initData

                // Parse the init data
                const parsedData = parseInitData(initData);
                console.log("Parsed Init Data:", parsedData); // Log the parsed data

                // Set parsed data in context
                setInitData(parsedData);
            }
        };

        // Only check if the SDK is loaded
        if (isSdkLoaded) {
            checkTelegram();
        }
    }, [isSdkLoaded, setInitData]);

    return (
        <>
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy="afterInteractive"
                onLoad={() => {
                    setIsSdkLoaded(true); // Set SDK loaded to true when script loads
                }}
            />
        </>
    );
};

// Function to parse initData
const parseInitData = (initData: string) => {
    const params = new URLSearchParams(initData);
    const parsedData: Record<string, any> = {};

    for (const [key, value] of params.entries()) {
        parsedData[key] = decodeURIComponent(value); // Decode directly
    }

    return parsedData;
};

export default TelegramInit;
