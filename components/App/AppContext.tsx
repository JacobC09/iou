"use client";

import { User } from "@/lib/schema";
import { AppData, getAppData } from "@/lib/server";
import { createContext, useContext, useEffect, useState } from "react";

type AppContextType = AppData & {
    set: (updated: Partial<AppData>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useAppContext(): AppContextType {
    return useContext(AppContext)!;
}

export default function AppContextProvider({ user, children }: Readonly<{
    user: User,
    children: React.ReactNode,
}>) {
    const [appData, setAppData] = useState<null | AppData>(null);

    useEffect(() => {
        getAppData(user).then(setAppData);
    }, []);

    if (!appData) return null;

    return (
        <AppContext.Provider value={{ ...appData, set:(updated) => setAppData({ ...appData, ...updated }) }}>
            {children}
        </AppContext.Provider>
    );
}