import { ResponsiveCommandDialog } from "@/components/ui/command";
import { MeetingForm } from "./meetings-form";
import { useRouter } from "next/navigation";
import { MeetingGetOne } from "../../types";


interface UpdateMeetingDialogProps {
    open: boolean;
    onOpenChange: (open:boolean) => void;
    initialValues: MeetingGetOne
}

export const UpdateMeetingDialog = ({ open, onOpenChange, initialValues}: UpdateMeetingDialogProps) => {
    const router = useRouter();
    return(
        <>
            <ResponsiveCommandDialog
                title="Update Meeting"
                description="Update the meeting to assist you with your tasks."
                open={open}
                onOpenChange={onOpenChange}
            >
                <MeetingForm
                    initialValues={initialValues}
                    onSuccess={(id) => {
                        onOpenChange(false);
                        router.push(`/meetings/${id}`);
                    }}
                    onCancel={() => onOpenChange(false)}
                 />
            </ResponsiveCommandDialog>
        </>
    )
}