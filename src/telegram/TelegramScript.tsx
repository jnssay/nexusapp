"use client";

import { useEffect } from "react";
import Script from 'next/script';

interface TelegramScriptProps {
  onInitData: (initData: string) => void;
}

// Custom component to load the Telegram script and initialize
const TelegramScript: React.FC<TelegramScriptProps> = ({ onInitData }) => {
  useEffect(() => {
    if (typeof window.Telegram !== "undefined") {
      window.Telegram.WebApp.ready();

      // Retrieve init data
      const initData = window.Telegram.WebApp.initData;
      console.log("Telegram Init Data:", initData);

      // Call the callback with the init data
      onInitData(initData);
    }
  }, [onInitData]);

  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js"
      strategy="afterInteractive"
    />
  );
};

export default TelegramScript;
