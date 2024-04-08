import {prisma} from "@/lib/prisma";
import {Button} from "@/components/ui/button";
import {signOut} from "next-auth/react";
import {Transcripts} from "@/components/transcripts";


export default async function UserTranscript({params} : {params: {ticket: string, user: string} }) {

    const getTicketTranscript = await prisma.messages.findMany({
        where: {
            ticket: {
                id: params.ticket,
                creator: {
                    userId: params.user
                }
            },
        },
        select: {
            message: true,
            authorIcon: true,
            authorUsername: true,
            ticketId: true,
            timestamp: true,
            authorId: true,
            ticket: {
                select: {
                    guild: {
                        select: {
                            staff: true
                        }
                    }
                }
            }
        },
        orderBy: {
            id: 'desc'
        }
    })
    console.log(getTicketTranscript.map(x => x.ticket.guild.staff))
    return (
        <>
            <Transcripts getTicketTranscript={getTicketTranscript} />
        </>
    )

}