import { CircleCheckIcon, CircleXIcon, ClockArrowUpIcon, Loader2Icon, LoaderIcon, VideoIcon } from "lucide-react";
import { MeetingStatus } from "../../types";
import { useMeetingsFilter } from "../../hooks/use-meetings-filter";
import { CommandSelect } from "@/components/command-select";


const options = [
    {
        id: MeetingStatus.Upcoming,
        value: MeetingStatus.Upcoming,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <ClockArrowUpIcon />
                {MeetingStatus.Upcoming}
            </div>
        ),
    },
    {
        id: MeetingStatus.Completed,
        value: MeetingStatus.Completed,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <CircleCheckIcon />
                {MeetingStatus.Completed}
            </div>
        ),
    },
    {
        id: MeetingStatus.Active,
        value: MeetingStatus.Active,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <VideoIcon />
                {MeetingStatus.Active}
            </div>
        ),
    },
    {
        id: MeetingStatus.Cancelled,
        value: MeetingStatus.Cancelled,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <CircleXIcon />
                {MeetingStatus.Cancelled}
            </div>
        ),
    },
    {
        id: MeetingStatus.Processing,
        value: MeetingStatus.Processing,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <LoaderIcon />
                {MeetingStatus.Processing}
            </div>
        ),
    },
    {
        id: MeetingStatus.CancelledByUser,
        value: MeetingStatus.CancelledByUser,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <CircleXIcon />
                {MeetingStatus.CancelledByUser}
            </div>
        ),
    },
    {
        id: MeetingStatus.CancelledByAgent,
        value: MeetingStatus.CancelledByAgent,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <CircleXIcon />
                {MeetingStatus.CancelledByAgent}
            </div>
        ),
    },
]

export const StatusFilter = () => {
    const [filters,setFilters] = useMeetingsFilter()
    return (
        <div className="flex items-center gap-x-2">
            <CommandSelect
                placeholder="Status"
                options={options}
                className="h-9"
                value={filters.status ?? undefined}
                onSelect={(value) => setFilters({status: value as MeetingStatus})}
            />
        </div>
    )
}