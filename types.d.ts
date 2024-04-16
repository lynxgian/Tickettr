import NextAuth from 'next-auth'
import {req} from 'next-auth'
 interface User {
    id: string
 }

declare module "next-auth" {
    interface Session {
        discordUser: User
    }
    interface NextRequestWithAuth {

        nextauth: {
            discordUser: User
        }
    }
}