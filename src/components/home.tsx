/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/PB4m5kEQIGb
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Rethink_Sans } from 'next/font/google'
import { Libre_Franklin } from 'next/font/google'

rethink_sans({
  subsets: ['latin'],
  display: 'swap',
})

libre_franklin({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import Link from "next/link"
import { FaGithub } from "react-icons/fa";
import {Button} from "@/components/ui/button";

export function  HomePage() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-[1fr_600px]">
        <div className="space-y-4 text-center lg:text-left">
          <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Discord Bot</div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">Tickettr</h1>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Tickettr is a feature-rich ticket bot with access to things such as transcripts and easy setup.
          </p>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300 dark:border-gray-800"
            href="https://discord.com/oauth2/authorize?client_id=1223122315298996266"
          >
            Add to Server
          </Link>
          <Link
              className="ml-2 inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300 dark:border-gray-800"
              href="https://discord.gg/dyMKBTBPMB"
          >
            Join Discord
          </Link>
        </div>
        <img
          alt="Image"
          className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center"
          height="500"
          src="/transparant-logo.png"
          width="500"
        />
      </div>
      <footer className="flex items-center justify-center py-6 px-4 md:px-6 border-t">
        <Link className={"pr-2"} href={'https://github.com/lynxgian/Tickettr'}><FaGithub /></Link>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Tickettr. All rights reserved.
        </p>
      </footer>
    </section>
  )
}
