import { ResponsiveCommandDialog } from "@/components/ui/command";
import { MeetingForm } from "./meetings-form";
import { useRouter } from "next/navigation";


interface NewMeetingDialogProps {
    open: boolean;
    onOpenChange: (open:boolean) => void;
}

export const NewMeetingDialog = ({ open, onOpenChange}: NewMeetingDialogProps) => {
    const router = useRouter();
    return(
        <>
            <ResponsiveCommandDialog
                title="New Meeting"
                description="Create a new meeting to assist you with your tasks."
                open={open}
                onOpenChange={onOpenChange}
            >
                <MeetingForm onSuccess={(id) => {
                    onOpenChange(false);
                    router.push(`/meetings/${id}`);
                }}
                onCancel={() => onOpenChange}
                 />
            </ResponsiveCommandDialog>
        </>
    )
}