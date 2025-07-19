import { CommandDialog, CommandInput, CommandList } from "@/components/ui/command"
import { CommandItem } from "cmdk";
import { Dispatch, SetStateAction } from "react";

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({open,setOpen} : Props) => {
    return(
        <>
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput 
                placeholder="Search..."
                className="w-[300px] md:w-[400px] lg:w-[500px] xl:w-[600px]"
            />
            <CommandList>
                <CommandItem>
                    Test
                </CommandItem>
            </CommandList>
        </CommandDialog>
        </>
    )
}