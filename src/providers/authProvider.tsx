"use client"
import {SessionProvider} from "next-auth/react";
import {Session} from "next-auth";
import {ReactNode} from "react";


export default function AuthProvider({session, children}: {
    session: Session,
    children: ReactNode
}) {

   return (
       <SessionProvider  session={session}>
           {children}
       </SessionProvider>
       )

}