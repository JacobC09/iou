import AppContextProvider from "@/components/App/AppContext";
import Navigation from "@/components/App/Navigation";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <AppContextProvider>
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
                    <Navigation />
                    {children}
                </div>
            </div>
        </AppContextProvider>
    );
}
