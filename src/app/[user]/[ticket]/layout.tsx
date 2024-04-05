import {Session} from "next-auth";
import {ReactNode} from "react";
import AuthProvider from "../../../providers/authProvider";

export default function UserTranscripts({session, children}: {session: Session, children: ReactNode}) {
return(
    <section>
        <AuthProvider session={session}>
            {children}
        </AuthProvider>
    </section>)
}