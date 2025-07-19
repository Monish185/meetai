import { ListHeader } from "@/app/modules/agents/ui/components/agent-list-header";
import { AgentsView } from "@/app/modules/agents/ui/views/agents-view";
import { LoadingState } from "@/components/loading-state";
import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AgentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if(!session){
    redirect('/auth/sign-in')
  }
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())
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