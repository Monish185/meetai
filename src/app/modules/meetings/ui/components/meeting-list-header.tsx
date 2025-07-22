"use client"
import { Button } from "@/components/ui/button"
import { PlusIcon, XCircleIcon, XIcon } from "lucide-react"
import { useState } from "react";
import { DEFAULT_PAGE } from "@/contants";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { MeetingsSearchFilter } from "./meetings-search-filter";
import { StatusFilter } from "./status-filter";
import { AgentsIdFilter } from "./agents-id-filter";
import { useMeetingsFilter } from "../../hooks/use-meetings-filter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const MeetingsListHeader = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [filters, setFilters] = useMeetingsFilter()
    const isAnyFilterModified = !!filters.search || !!filters.status || !!filters.agentId

    const handleClearFilters = () => {
        setFilters({
            search: "",
            status: null,
            agentId: "",
            page: DEFAULT_PAGE,
        })
    }
    return (
        <>
        <NewMeetingDialog open={isDialogOpen} onOpenChange={setDialogOpen} />
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl">My Meetings</h5>
                <Button onClick={() => setDialogOpen(true)}>
                    <PlusIcon />
                    New Meeting
                </Button>
            </div> 
            <ScrollArea>
            <div className="flex items-center gap-x-2 p-1">
                <MeetingsSearchFilter />
                <StatusFilter />
                <AgentsIdFilter />
                {isAnyFilterModified && (
                    <Button variant="outline" onClick={handleClearFilters}>
                        <XCircleIcon className="size-4"/>
                        Clear Filters
                    </Button>
                )}
            </div>
            <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
        </>
    )
}