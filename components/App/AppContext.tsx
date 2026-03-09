"use client";

import { contactTable, profileTable, transactionTable, userTable } from "@/lib/schema";
import { createContext, useContext } from "react";

interface AppData {
    user: typeof userTable.$inferSelect;
    profile: typeof profileTable.$inferSelect;
    transactions: typeof transactionTable.$inferSelect[];
    contacts: typeof contactTable.$inferSelect[];
}

const AppContext = createContext<AppData | undefined>(undefined);

export function useAppContext(): AppData {
    return useContext(AppContext)!;
}

export default function AppContextProvider({ children, data }: Readonly<{
    children: React.ReactNode,
    data: AppData,
}>) {
    return (
        <AppContext.Provider value={data}>
            {children}
        </AppContext.Provider>
    );
}
