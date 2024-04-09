"use client"
import {Login} from "@/components/login";
import {signOut, useSession} from "next-auth/react";
import {Button} from "@/components/ui/button";


export default function Home() {
    const {data: session} =  useSession()
    console.log(session)
    if(!session) {
        return (
            <>
                <Login />
            </>
        )
    }

    return (
        <Button onClick={() => signOut()}>Sign Out</Button>
    )

}