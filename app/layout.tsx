import type { Metadata } from "next";

// @ts-ignore
import "./globals.css";

export const metadata: Metadata = {
    title: "Ledger",
    description: "A debt tracking application",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
