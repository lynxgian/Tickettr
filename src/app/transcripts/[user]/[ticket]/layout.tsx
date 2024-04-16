import {Session} from "next-auth";
import React, {ReactNode} from "react";

export default function UserTranscripts({children}: {children: ReactNode}) {
return(
    <section>
            {children}
    </section>)
}