"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "../components/data-table";
import {columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilter } from "../../hooks/use-agents-filter";
import { DataTablePagination } from "../components/data-pagination";
import { useRouter } from "next/navigation";


export const AgentsView = () => {
    const router = useRouter()
    const trpc = useTRPC();
    const [filters,setFilters] = useAgentsFilter();

    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters,
        
    }));

    console.log("Agents data:", data);

    if (!data || data.items.length === 0) {
        return (
            <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
                <EmptyState 
                    title="No agents yet" 
                    description="Create your first agent to get started with AI assistance."
                />
            </div>
        );
    }

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data.items} columns={columns} onRowClick={(row) => router.push(`/agents/${row.id}`)} />
            <DataTablePagination 
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => setFilters({page})}
            />
        </div>
    )
}