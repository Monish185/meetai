import { AgentIdView, AgentIdViewError, AgentIdViewLoading } from "@/app/modules/agents/ui/views/agent-Id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";

interface AgentPageProps {
    params: Promise<{agentId: string}>
}

export default async function AgentPage({params}: AgentPageProps) {
    const {agentId} = await params;
    const queryClient =  getQueryClient();

    void queryClient.prefetchQuery(
        trpc.agents.getOne.queryOptions({id: agentId})
    )

    return(
        <HydrationBoundary>
            <Suspense fallback={<AgentIdViewLoading/>}>
                <ErrorBoundary errorComponent={AgentIdViewError}>
                    <AgentIdView agentId={agentId}/>
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}