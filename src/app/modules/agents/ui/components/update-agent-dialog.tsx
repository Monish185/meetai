import { ResponsiveCommandDialog } from "@/components/ui/command";
import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../../types";


interface UpdateAgentDialogProps {
    open: boolean;
    onOpenChange: (open:boolean) => void;
    initialValues: AgentGetOne;
}

export const UpdateAgentDialog = ({ open, onOpenChange, initialValues}: UpdateAgentDialogProps) => {
    return(
        <>
            <ResponsiveCommandDialog
                title="Edit Agent"
                description="Edit the agent to assist you with your tasks."
                open={open}
                onOpenChange={onOpenChange}
            >
                <AgentForm onSuccess={() => {
                    onOpenChange(false);
                }}
                onCancel={() => {
                    onOpenChange(false);
                }}
                initialValues={initialValues}
                 />
            </ResponsiveCommandDialog>
        </>
    )
}