import { useTRPC } from "@/trpc/client"
import { useMeetingsFilter } from "../../hooks/use-meetings-filter"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { CommandSelect } from "@/components/command-select"
import GeneratedAvatar from "@/components/generated-avatar"


export const AgentsIdFilter = () => {
    const [filters,setFilters] = useMeetingsFilter()

    const trpc = useTRPC()
    const [agentSearch,setAgentSearch] = useState("")
    const {data} = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch,
        }),
    )

    return (
        <>
            <CommandSelect 
                className="h-9"
                placeholder="Agent"
                options={(data?.items ?? []).map((agent) => ({
                    id: agent.id,
                    value: agent.id,
                    children: <div className="flex items-center gap-x-2 capitalize">
                        <GeneratedAvatar 
                            seed={agent.name}
                            variant="botttsNeutral"
                            className="size-4"
                        />
                        {agent.name}
                    </div>,
                }))}
                onSelect={(value) => setFilters({agentId: value as string})}
                onSearch={(value) => setAgentSearch(value)}
                value={filters.agentId ?? undefined}
            />
        </>
    )
}