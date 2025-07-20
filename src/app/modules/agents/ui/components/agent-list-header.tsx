"use client"
import { Button } from "@/components/ui/button"
import { PlusIcon, XIcon } from "lucide-react"
import { NewAgentDialog } from "./new-agent-dialog"
import { useState } from "react";
import { useAgentsFilter } from "../../hooks/use-agents-filter";
import { AgentsSearchFilter } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/contants";

export const ListHeader = () => {
    const [fileters,setFilters] = useAgentsFilter()
    const [isDialogOpen, setDialogOpen] = useState(false);
    const isAnyFilterModified = !!fileters.search

    const onClearFilters = () => {
        setFilters({
            search: "",
            page: DEFAULT_PAGE,
        })
    }
    return (
        <>
        <NewAgentDialog open={isDialogOpen} onOpenChange={setDialogOpen} />
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl">My Agents</h5>
                <Button onClick={() => setDialogOpen(true)}>
                    <PlusIcon />
                    New Agent
                </Button>
            </div> 
            <div className="flex items-center gap-x-2 p-1">
                <AgentsSearchFilter />
                {isAnyFilterModified && (
                    <Button variant="outline" size="icon" onClick={onClearFilters} className="size-8">
                        <XIcon className="size-4" />
                    </Button>
                )}
            </div>
        </div>
        </>
    )
}