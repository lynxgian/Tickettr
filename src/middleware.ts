import {NextRequestWithAuth, withAuth} from "next-auth/middleware"
import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export default withAuth(
   async function middleware(req){
       const url = req.nextUrl.pathname.split('/')
       const userId = url[2]
       const ticketId = url[3]
       const authUser = req.nextauth.token.sub

       const ticketData = await prisma.ticket.findFirst({
           where: {
               id: ticketId,
               creator: {
                   userId: userId
               }
           },
           select: {
               creator: {
                   select: {
                       userId: true
                   }
               },
               guild: {
                   select: {
                       staff: true
                   }
               }
           }
       })

       console.log(!ticketData)
       if (!ticketData || !ticketData?.creator.userId.startsWith(authUser) && !ticketData?.guild.staff.find(x => x === authUser)) {
           return NextResponse.redirect(new URL('/404', req.url))
       }
       return NextResponse.next()
   }

)


export const config = { matcher: ["/transcripts/:path*"] }

