import {Session} from "next-auth";
import React, {ReactNode} from "react";
import AuthProvider from "../../../providers/authProvider";
export default function UserTranscripts({children}: {children: ReactNode}) {
return(
    <section>
            {children}
    </section>)
}