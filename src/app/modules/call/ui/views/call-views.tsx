"use client";
import { ErrorState } from "@/components/error-state";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CallProvider } from "../components/call-provider"; 
import { useTRPC } from "@/trpc/client";

interface CallViewProps {
    meetingId: string;
}

export const CallView = ({meetingId}: CallViewProps) => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.meetings.getOne.queryOptions({id: meetingId}));

    if(data.status === "completed"){
        return (
            <>
                <div className="flex h-screen items-center justify-center">
                    <ErrorState 
                        title="Meeting has ended"
                        description="The meeting has ended. You can close this window now."
                    />
                </div>
            </>
        )
    }

    return (
        <div>
            <CallProvider meetingId={meetingId} meetingName={data.name} />
        </div>
    )
}