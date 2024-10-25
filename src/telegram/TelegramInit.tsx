"use client"

import { useEffect, useState } from "react";
import Script from 'next/script';
import { useInitData } from '~/telegram/InitDataContext';
import { useRouter } from 'next/navigation';

const TelegramInit: React.FC = () => {
    const { setInitData, setUser } = useInitData();
    const [isSdkLoaded, setIsSdkLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkTelegram = async () => {
            if (typeof window !== "undefined" && window.Telegram) {
                window.Telegram.WebApp.ready();

                const initData = window.Telegram.WebApp.initData;
                const parsedData = parseInitData(initData);

                const user = await checkOrCreateUser(parsedData);

                setInitData(parsedData); // Save initData in context
                setUser(user); // Save user in context

                const themeParams = window.Telegram.WebApp.themeParams;
                if (themeParams) {
                    applyThemeColors(themeParams);
                }

                // Check for start_param and redirect if present
                if (parsedData.start_param) {
                    const startParam = parsedData.start_param;

                    if (startParam.endsWith("newidea")) {
                        // Remove "newidea" from the end of the parameter
                        const baseParam = startParam.replace("newidea", "");
                        router.push(`/event/${baseParam}/newidea`);
                    } else {
                        router.push(`/event/${startParam}`);
                    }
                }
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

    // Parse the user data
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

        console.log("Sending to API:", userData);

        const response = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: userData.id,
                firstName: userData.first_name,
                lastName: userData.last_name,
                username: userData.username,
            }),
        });

        if (response.ok) {
            const user = await response.json();
            console.log("User created/checked:", user);
            return user;
        } else {
            console.error("Error checking/creating user:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

// Utility function to convert hex to HSL
const hexToHSL = (hex: string) => {
    // Remove the hash if it exists
    hex = hex.replace(/^#/, '');

    // Parse the r, g, b values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Convert to a range of 0-1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find the maximum and minimum values to get luminance
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h *= 60; // Convert to degrees
    }

    // Convert to percentages
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    h = Math.round(h); // Ensure h is always a number

    return `${h} ${s}% ${l}%`;
};

const applyThemeColors = (themeParams: Record<string, any>) => {
    const root = document.documentElement;
    console.log("Received theme parameters:", themeParams);

    // Use hexToHSL to convert hex colors to HSL before applying them
    if (themeParams.bg_color) {
        root.style.setProperty("--background", hexToHSL(themeParams.bg_color));
    }
    if (themeParams.text_color) {
        root.style.setProperty("--foreground", hexToHSL(themeParams.text_color));
    }
    if (themeParams.hint_color) {
        root.style.setProperty("--primary", hexToHSL(themeParams.hint_color));
    }
    if (themeParams.bottom_bar_bg_color) {
        root.style.setProperty("--primary-foreground", hexToHSL(themeParams.bottom_bar_bg_color));
    }
    if (themeParams.button_color) {
        root.style.setProperty("--secondary", hexToHSL(themeParams.button_color));
    }
    if (themeParams.button_text_color) {
        root.style.setProperty("--secondary-foreground", hexToHSL(themeParams.button_text_color));
    }
    if (themeParams.secondary_bg_color) {
        root.style.setProperty("--accent", hexToHSL(themeParams.secondary_bg_color));
    }
    if (themeParams.accent_text_color) {
        root.style.setProperty("--accent-foreground", hexToHSL(themeParams.accent_text_color));
    }
    if (themeParams.destructive_text_color) {
        root.style.setProperty("--destructive-foreground", hexToHSL(themeParams.destructive_text_color));
    }
    if (themeParams.section_bg_color) {
        root.style.setProperty("--muted", hexToHSL(themeParams.section_bg_color));
    }
    if (themeParams.subtitle_text_color) {
        root.style.setProperty("--muted-foreground", hexToHSL(themeParams.subtitle_text_color));
    }
    if (themeParams.section_header_text_color) {
        root.style.setProperty("--popover", hexToHSL(themeParams.section_header_text_color));
    }
    if (themeParams.header_bg_color) {
        root.style.setProperty("--popover-foreground", hexToHSL(themeParams.header_bg_color));
    }
    if (themeParams.section_separator_color) {
        root.style.setProperty("--border", hexToHSL(themeParams.section_separator_color));
    }
    if (themeParams.link_color) {
        root.style.setProperty("--input", hexToHSL(themeParams.link_color));
    }
};


export default TelegramInit;
