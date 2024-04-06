import React from "react";
import {getServerSession, Session, unstable_getServerSession} from "next-auth";
import AuthProvider from "../providers/authProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {handler} from "tailwindcss-animate";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Tickettr",
    description: "Best of the rest ticket bot!",
};


export default async function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    //@ts-ignore
    const session = await getServerSession(handler)
    return (
        <html lang="en">
        <body>

        <main>
            <AuthProvider session={session}>
                {children}
            </AuthProvider>
        </main>
        </body>
        </html>
    )
}