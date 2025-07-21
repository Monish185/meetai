"use client";

import { useTRPC } from "@/trpc/client";
import {  useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "@/components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useMeetingsFilter } from "../../hooks/use-meetings-filter";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DataTablePagination } from "@/components/data-pagination";

export const MeetingsView = () => {
    const trpc = useTRPC();
    const [filters,setFilters] = useMeetingsFilter()
    const {data} = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        ...filters,
    }))
    const router = useRouter()


    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data.items} columns={columns} onRowClick={(row) => router.push(`/meetings/${row.id}`)} />
            <DataTablePagination 
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => setFilters({page})}
            />
                {data.items.length === 0 && (
                    <EmptyState 
                        title="No meetings yet" 
                        description="Create your first meeting to get started with AI assistance. You can create a meeting by clicking the 'New Meeting' button in the top right corner."
                    />
                )}
        </div>
    )
}

export const MeetingsViewLoading = () => {
    return (
        <LoadingState
            title="Loading Meetings"
            description="Please wait while we load the meetings"
        />
    )
}

export const MeetingsViewError = () => {
    return (
        <ErrorState
            title="Error Loading Meetings"
            description="Please try again later"
        />
    )
}