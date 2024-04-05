
import {prisma} from "../../../lib/prisma";


export  async function GetMessages({ticketId, userId} : {ticketId: string, userId: string}) {
    //@ts-ignore
    const getTicketTranscript = await prisma.messages.findMany({
        where: {
            ticket: {
                id: parseInt(ticketId),
                creator: {
                    userId
                }
            }
        },
        select: {
            message: true
        }
    })
    console.log(getTicketTranscript)
    if(!getTicketTranscript) {
        return (
            <p>No ticket Found</p>
        )
    }
    return (
        <>
            {getTicketTranscript.map(x => {
               return (
                   <p>Message: {x.message}</p>
               )

            })}
        </>
    )
}



export default async function UserTranscript({params} : {params: {ticket: string, user: string} }) {
    return (
        <>
            <GetMessages  userId={params.user} ticketId={params.ticket}/>
        </>
    )

}