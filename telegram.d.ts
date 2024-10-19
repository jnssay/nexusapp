export { };

declare global {
    interface Window {
        Telegram: {
            WebApp: {
                ready: () => void;
                initData: string;
                initDataUnsafe?: any;
                themeParams?: {
                    bg_color?: string;
                    text_color?: string;
                    link_color?: string;
                    button_color?: string;
                    button_text_color?: string;
                    hint_color?: string;
                };
            };
        }
    }
}
