"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";

export const AgentsView = () => {
    const trpc = useTRPC();

    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());


    return (
        <div>
            <ResponsiveDialog title="test" description="test hai bhai" open={true} onOpenChange={() => {}}>
                <Button>
                    Click plzz
                </Button>
            </ResponsiveDialog>
            {JSON.stringify(data,null,2)}
        </div>
    )
}