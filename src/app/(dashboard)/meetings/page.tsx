import { MeetingsView, MeetingsViewError, MeetingsViewLoading } from "@/app/modules/meetings/ui/views/meetings-view";
import { dehydrate, HydrationBoundary, useQueryClient } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MeetingsListHeader } from "@/app/modules/meetings/ui/components/meeting-list-header";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { loadSearchParams } from "@/app/modules/agents/params";
import { SearchParams } from "nuqs/server";

interface Props{
    searchParams: Promise<SearchParams>
}
const Page = async ({searchParams}: Props) => {
    const params = await loadSearchParams(searchParams)
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        redirect("/auth/sign-in");
    }
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({
        ...params,
    }));
    const dehydratedState = dehydrate(queryClient); 
    return (
        <>
        <MeetingsListHeader />
        <HydrationBoundary state={dehydratedState}>
            <Suspense fallback={<MeetingsViewLoading />}>
                <ErrorBoundary fallback={<MeetingsViewError />}>
                    <MeetingsView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
        </>
    )
}

export default Page;