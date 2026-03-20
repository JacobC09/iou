"use client";

import { AppData, getAppData } from "@/lib/server";
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext<AppData | null>(null);

export function useAppContext(): AppData {
    return useContext(AppContext)!;
}

export default function AppContextProvider({ children }: Readonly<{
    children: React.ReactNode,
}>) {
    const [appData, setAppData] = useState<null | AppData>(null);

    useEffect(() => {
        getAppData().then(setAppData);
    }, []);

    if (!appData) return null;

    return (
        <AppContext.Provider value={appData}>
            {children}
        </AppContext.Provider>
    );
}