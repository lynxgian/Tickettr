"use client"
import {Button} from "@/components/ui/button";
import {getSession, signOut, useSession} from "next-auth/react";

interface TicketTranscriptInterface {
    getTicketTranscript: {
        message: string,
        authorIcon: string
        authorUsername: string
        timestamp: string
        authorId: string
        ticket: {
            guild: {
                staff: string[]
            }
        }
    }[]
}

export function Transcripts({getTicketTranscript}: TicketTranscriptInterface) {

  return (
    <div className="w-full px-4 md:px-6 xl:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl/none">Transcript</h1>
          <p className="text-gray-500 dark:text-gray-400">Conversation with support</p>
            <Button onClick={() => signOut()}>Sign Out</Button>

        </div>
        {getTicketTranscript.map((x, key) => {
          return (

              <div key={key} className="space-y-8">
                <div className="flex space-x-4">
                  <div className="flex items-start">
                    <img
                        alt="Avatar"
                        className="rounded-full"
                        height={48}
                        src={x.authorIcon}
                        style={{
                          aspectRatio: "48/48",
                          objectFit: "cover",
                        }}
                        width={48}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <div className="flex items-center space-x-2">
                      <div className="font-semibold">{x.authorUsername}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{x.timestamp}</div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg dark:bg-gray-800">
                      <p className="text-sm">
                        {x.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
          )
        })}
        </div>
      </div>
  )
}
