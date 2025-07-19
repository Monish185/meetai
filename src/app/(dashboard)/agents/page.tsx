import { AgentsView } from "@/app/modules/agents/ui/views/agents-view";
import { LoadingState } from "@/components/loading-state";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export default function AgentsPage() {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<LoadingState title="Loading Agents..." description="Please wait while we load your agents"/>}>
            <AgentsView />
        </Suspense>
      </HydrationBoundary>
    </>
  );
}