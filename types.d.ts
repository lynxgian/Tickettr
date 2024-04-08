import NextAuth from 'next-auth'
 interface User {
    id: string
 }

declare module "next-auth" {
    interface Session {
        discordUser: User
    }
}