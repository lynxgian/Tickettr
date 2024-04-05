import React from "react";
import {Session} from "next-auth";
import AuthProvider from "../providers/authProvider";

export default function RootLayout({
                                    session,
                                       children,
                                   }: {
    session: Session
    children: React.ReactNode
}) {
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