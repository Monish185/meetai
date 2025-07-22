import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { VideoIcon } from "lucide-react"

interface ActiveStateProps {
    meetingId: string; 
}

export const ActiveState = ({meetingId}: ActiveStateProps) => {
    return(
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState 
                title="Meeting is Active" 
                description="The meeting is currently active. You can join the meeting by clicking the button below." 
                image="/upcoming.svg" />
            <div className="flex flex-col-reverse lg:flex-row lg:justify-center gap-2 items-center w-full">
                <Button className="w-full lg:w-auto" asChild>
                    <Link href={`/call/${meetingId}`}>  
                        <VideoIcon />
                        Join Meeting
                    </Link>
                </Button>
            </div>
        </div>
    )
}