import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { VideoIcon, BanIcon } from "lucide-react"

interface UpcomingStateProps {
    meetingId: string;
    onCancel: () => void;
    isCancelled: boolean;   
}

export const UpcomingState = ({meetingId, onCancel, isCancelled}: UpcomingStateProps) => {
    return(
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState 
                title="Not Started yet" 
                description="Once the meeting is started, you will be able to see the details here." 
                image="/upcoming.svg" />
            <div className="flex flex-col-reverse lg:flex-row lg:justify-center gap-2 items-center w-full">
                    <Button variant="secondary" className="w-full lg:w-auto" onClick={onCancel} disabled={isCancelled}>
                        <BanIcon />
                        Cancel Meeting
                    </Button>
                    <Button className="w-full lg:w-auto" asChild disabled={isCancelled}>
                        <Link href={`/call/${meetingId}`}>  
                            <VideoIcon />
                            Start Meeting
                        </Link>
                    </Button>
            </div>
        </div>
    )
}