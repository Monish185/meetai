import { CallView } from "@/app/modules/call/ui/views/call-views";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";




interface CallPageProps {
    params: Promise<{meetingId: string}>;
}

const CallPage = async ({params}: CallPageProps) => {
    const {meetingId} = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth/sign-in");
    }

    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({id: meetingId})
    )

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<LoadingState title="Loading Meeting..." description="Please wait while we load the meeting..." />}>
            <ErrorBoundary fallback={<ErrorState title="Error Loading Meeting..." description="Please try again later." />}>
                <CallView meetingId={meetingId} />
            </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
    
}

export default CallPage;