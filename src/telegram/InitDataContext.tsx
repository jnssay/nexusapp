"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type InitDataContextType = {
    initData: Record<string, any> | null;
    setInitData: (data: Record<string, any>) => void;
    user: Record<string, any> | null; // Store the user session data
    setUser: (user: Record<string, any>) => void; // Method to set user data
};

const InitDataContext = createContext<InitDataContextType | undefined>(undefined);

export const InitDataProvider = ({ children }: { children: ReactNode }) => {
    const [initData, setInitData] = useState<Record<string, any> | null>(null);
    const [user, setUser] = useState<Record<string, any> | null>(null); // New user state

    return (
        <InitDataContext.Provider value={{ initData, setInitData, user, setUser }}>
            {children}
        </InitDataContext.Provider>
    );
};

export const useInitData = () => {
    const context = useContext(InitDataContext);
    if (!context) {
        throw new Error("useInitData must be used within an InitDataProvider");
    }
    return context;
};
