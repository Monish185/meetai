"use client";

import { authClient } from "@/lib/auth-client";
import { Loader2Icon } from "lucide-react";
import { CallConnect } from "./call-connect";
import { generateAvatarUri } from "@/lib/avatar";


interface CallProviderProps {
    meetingId: string;
    meetingName: string;
}

export const CallProvider = ({meetingId, meetingName}: CallProviderProps) => {
    const {data,isPending} = authClient.useSession();

    if(isPending || !data){
        return(
            <>
                <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                    <Loader2Icon className="animate-spin text-primary size-6"/>
                </div>
            </>
        )
    }

    return (
        <>
            <div>
                <CallConnect 
                    meetingId={meetingId}
                    meetingName={meetingName}
                    userId={data.user.id}
                    userName={data.user.name}
                    userImage={
                        data.user.image ?? 
                        generateAvatarUri({seed: data.user.name, variant: "initials"})
                    }
                />
            </div>
        </>
    )
}