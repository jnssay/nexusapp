// telegram.d.ts
export { };

declare global {
    interface Window {
        Telegram: {
            WebApp: {
                ready: () => void;
                initData: string;
            };
        };
    }
}
