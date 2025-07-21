"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import GeneratedAvatar from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "../../hooks/use-confirm";
import { UpdateAgentDialog } from "../components/update-agent-dialog";
import { useState } from "react";

interface AgentIdViewProps {
    agentId: string;
}

export const AgentIdView = ({agentId}: AgentIdViewProps) => {
    const trpc = useTRPC()
    const {data} = useSuspenseQuery(trpc.agents.getOne.queryOptions({id: agentId}))

    const router = useRouter();
    const queryClient = useQueryClient()

    const removeAgent = useMutation(trpc.agents.remove.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
            router.push("/agents")
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    const [UpdateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false)

    const [ConfirmDialog, confirm] = useConfirm("Remove Agent", `Are you sure you want to remove this agent? This will remove all the ${data.meetingCount} meetings associated with this agent.`)

    const handleRemove = async () => {
        const confirmed = await confirm();
        if (!confirmed) return;
        try {
            await removeAgent.mutateAsync({id: agentId})
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong")
        }
    }

    return (
        <>
        <ConfirmDialog />
        <UpdateAgentDialog 
            open={UpdateAgentDialogOpen}
            onOpenChange={setUpdateAgentDialogOpen}
            initialValues={data}
        />
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <AgentIdViewHeader
                agentId={agentId}  
                agentName={data.name} 
                onEdit={() => setUpdateAgentDialogOpen(true)} 
                onRemove={handleRemove}
            />
            <div className="bg-white rounded-lg border">
                <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                    <div className="flex items-center gap-x-3">
                        <GeneratedAvatar 
                            variant="botttsNeutral"
                            seed={data.name}
                            className="size-10"
                        />
                        <h2 className="text-2xl font-medium">{data.name}</h2>
                    </div>
                    <Badge variant={"outline"} className="flex items-center gap-x-2 [&>svg]:size-4">
                        <VideoIcon className="text-blue-700"/>
                        {data.meetingCount} {data.meetingCount === 1 ? "Meeting" : "Meetings"}
                    </Badge>
                    <div className="flex flex-col gap-y-4">
                        <p className="text-lg font-medium">Instructions </p>
                        <p className="text-sm text-muted-foreground">{data.instructions}</p>
                    </div>
                </div>
            </div>
            {/* <AgentIdViewContent
                agentId={agentId}
            /> */}
        </div>
        </>
    )
}

export const AgentIdViewLoading = () => {
    return (
        <LoadingState title="Loading agent..." description="Please wait while we load the agent details." />
    )
}

export const AgentIdViewError = () => {
    return (
        <ErrorState
            title="Error loading agent"
            description="Please try again later."
        />
    )
}