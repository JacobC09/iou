import AppContextProvider from "@/components/App/AppContext";
import Navigation from "@/components/App/Navigation";
import { contactTable, profileTable, transactionTable } from "@/lib/schema";
import { db } from "@/lib/db";
import { eq, or } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getSession();

    if (!user) {
        redirect("/auth");
    }

    const profile = await db.query.profileTable.findFirst({
        where: eq(profileTable.linkedUserId, user.id)
    });

    if (!profile) redirect("/auth");

    const [transactions, contacts] = await Promise.all([
        db.select()
            .from(transactionTable)
            .where(
                or(
                    eq(transactionTable.fromProfile, profile.id),
                    eq(transactionTable.toProfile, profile.id)
                )
            ),
        db.select()
            .from(contactTable)
            .where(eq(contactTable.owner, profile.id))
    ]);

    return (
        <AppContextProvider data={{ user, profile, transactions, contacts }}>
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
                    <Navigation />
                    {children}
                </div>
            </div>
        </AppContextProvider>
    );
}
