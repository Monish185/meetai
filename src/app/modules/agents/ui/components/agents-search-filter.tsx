import { Input } from "@/components/ui/input"
import { useAgentsFilter } from "../../hooks/use-agents-filter"
import { SearchIcon } from "lucide-react"


export const AgentsSearchFilter = () => {
    const [filters,setFilters] = useAgentsFilter()
    return (
        <div className="relative flex items-center gap-x-2">
            <Input
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                placeholder="Search agents"
                className="h-9 bg-white w-[200px] pl-7"
            />
            <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
    )
}