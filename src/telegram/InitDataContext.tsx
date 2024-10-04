"use client";

import React, { createContext, useContext, useState } from 'react';

interface InitDataContextType {
    initData: Record<string, any> | null;
    setInitData: (data: Record<string, any>) => void;
}

const InitDataContext = createContext<InitDataContextType | undefined>(undefined);

export const InitDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [initData, setInitData] = useState<Record<string, any> | null>(null);

    return (
        <InitDataContext.Provider value={{ initData, setInitData }}>
            {children}
        </InitDataContext.Provider>
    );
};

export const useInitData = (): InitDataContextType => {
    const context = useContext(InitDataContext);
    if (!context) {
        throw new Error("useInitData must be used within an InitDataProvider");
    }
    return context;
};
