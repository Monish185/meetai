import { loadSearchParams } from "@/app/modules/agents/params";
import { ListHeader } from "@/app/modules/agents/ui/components/agent-list-header";
import { AgentsView } from "@/app/modules/agents/ui/views/agents-view";
import { LoadingState } from "@/components/loading-state";
import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import { Suspense } from "react";

interface AgentsPageProps {
  searchParams: Promise<SearchParams>
}

export default async function AgentsPage({searchParams}: AgentsPageProps) {

  const params = await loadSearchParams(searchParams)
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if(!session){
    redirect('/auth/sign-in')
  }
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
      ...params,
    }))
  return (
    <> 
      <ListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<LoadingState title="Loading Agents..." description="Please wait while we load your agents"/>}>
            <AgentsView />
        </Suspense>
      </HydrationBoundary>
    </>
  );
}