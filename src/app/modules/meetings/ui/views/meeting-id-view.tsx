"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/app/modules/agents/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";

interface MeetingIdViewProps {
    meetingId: string;
}

export const MeetingIdView = ({meetingId}: MeetingIdViewProps) => {

    const trpc = useTRPC();
    const router = useRouter();
    const [UpdateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false)
    const {data} = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({
            id: meetingId,
        })
    )

    const queryClient = useQueryClient()
    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))
                router.push("/meetings")
            },
            onError: () => {
                toast.error("Failed to delete meeting")
            }
        })
    )

    const [ConfirmDialog, confirm] = useConfirm("Remove Meeting", `Are you sure you want to remove this meeting?`) 

    const handleRemove = async () => {
        const confirmed = await confirm();
        if (!confirmed) return;
        try {
            await removeMeeting.mutateAsync({id: meetingId})
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong")
        }
    }
        return(
        <>
        <ConfirmDialog />
        <UpdateMeetingDialog
            open={UpdateMeetingDialogOpen}
            onOpenChange={setUpdateMeetingDialogOpen}
            initialValues={data}
        />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader
                    meetingId={meetingId}
                    meetingName={data.name}
                    onEdit={() => setUpdateMeetingDialogOpen(true)}
                    onRemove={handleRemove}
                />
            </div>
        </>
    )
}

export const MeetingIdViewLoading = () => {
    return(
        <LoadingState title="Loading Meeting..." description="This may take a few seconds"/>
    )
}

export const MeetingIdViewError = () => {
    return(
        <ErrorState title="Error Loading Meeting" description="Please try again later"/>
    )
}