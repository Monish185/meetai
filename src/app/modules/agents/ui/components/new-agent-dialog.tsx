import { ResponsiveCommandDialog } from "@/components/ui/command";
import { AgentForm } from "./agent-form";


interface NewAgentDialogProps {
    open: boolean;
    onOpenChange: (open:boolean) => void;
}

export const NewAgentDialog = ({ open, onOpenChange}: NewAgentDialogProps) => {
    return(
        <>
            <ResponsiveCommandDialog
                title="New Agent"
                description="Create a new agent to assist you with your tasks."
                open={open}
                onOpenChange={onOpenChange}
            >
                <AgentForm onSuccess={() => {
                    onOpenChange(false);
                }}
                onCancel={() => {
                    onOpenChange(false);
                }}
                 />
            </ResponsiveCommandDialog>
        </>
    )
}