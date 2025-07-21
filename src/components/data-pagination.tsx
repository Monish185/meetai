import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface DataTablePaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const DataTablePagination = ({page, totalPages, onPageChange}: DataTablePaginationProps) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-x-2">
                <Button variant="outline" size="icon" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
                    <ChevronLeftIcon className="size-4" />
                </Button>
                <span className="text-sm font-medium">
                    Page {page} of {totalPages || 1}
                </span>
                <Button variant="outline" size="icon" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
                    <ChevronRightIcon className="size-4" />
                </Button>
            </div>
        </div>
    )
}