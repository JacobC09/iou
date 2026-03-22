import AppContextProvider from "@/components/App/AppContext";
import Navigation from "@/components/App/Navigation";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getSession();
    if (!user) return redirect("/auth");

    return (
        <AppContextProvider user={user}>
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
                    <Navigation />
                    {children}
                </div>
            </div>
        </AppContextProvider>
    );
}
