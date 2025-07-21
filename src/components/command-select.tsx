import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ChevronsUpDownIcon } from "lucide-react";
import { CommandGroup, CommandItem, CommandEmpty, CommandInput, ResponsiveCommandDialog, CommandList } from "./ui/command";


interface CommandSelectProps{
    options: Array<{
        id: string;
        value: string;
        children: ReactNode;
    }>;
    onSelect: (value: string) => void;
    onSearch?: (value: string) => void;
    placeholder?: string;
    className?: string;
    value?: string;
    isSearchable?: boolean;
}

export const CommandSelect = ({options, onSelect, onSearch, placeholder="Select an option", className, value, isSearchable}: CommandSelectProps) => {
    const [open, setOpen] = useState(false);
    const selectedOption = options.find((option) => option.value === value);

    const handleOpenChange = (open: boolean) => {
        onSearch?.("");
        setOpen(open);
    }
    return (
        <>
            <Button
                onAuxClick={() => setOpen(true)}
                type="button"
                variant="outline"
                className={cn("h-9 justify-between font-normal px-2",!selectedOption && "text-muted-foreground", className)}
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-center gap-2">
                    {selectedOption?.children ?? placeholder}
                </div>
                <ChevronsUpDownIcon className="size-4" />
            </Button>
            <ResponsiveCommandDialog open={open} onOpenChange={handleOpenChange} shouldFilter={!onSearch}>
                <CommandInput placeholder="Search..." onValueChange={onSearch} />
                <CommandList>
                    <CommandEmpty>
                        <span className="text-sm text-muted-foreground">No results found</span>
                    </CommandEmpty>
                    {options.map((option) => (
                        <CommandItem key={option.id} value={option.value} onSelect={() => {
                            onSelect(option.value); 
                            setOpen(false);
                        }}>
                            {option.children}
                        </CommandItem>
                    ))}
                </CommandList>
            </ResponsiveCommandDialog>
        </>
    )
}