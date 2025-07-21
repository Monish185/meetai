import { MeetingsView, MeetingsViewError, MeetingsViewLoading } from "@/app/modules/meetings/ui/views/meetings-view";
import { dehydrate, HydrationBoundary, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Page = () => {
    const queryClient = useQueryClient();
    void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}));
    const dehydratedState = dehydrate(queryClient);
    return (
        <HydrationBoundary state={dehydratedState}>
            <Suspense fallback={<MeetingsViewLoading />}>
                <ErrorBoundary fallback={<MeetingsViewError />}>
                    <MeetingsView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page;