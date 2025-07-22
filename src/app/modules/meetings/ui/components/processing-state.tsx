import { EmptyState } from "@/components/empty-state"



export const ProcessingState = () => {
    return(
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState 
                title="Meeting is Processing" 
                description="The meeting is currently being processed. You will be able to see the summary here once the processing is complete." 
                image="/processing.svg" />
        </div>
    )
}