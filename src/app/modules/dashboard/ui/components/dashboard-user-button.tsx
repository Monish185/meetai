import GeneratedAvatar from "@/components/generated-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client"
import { createAuthClient } from "better-auth/react";
import { ChevronDownIcon, CreditCardIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const DashboardUserButton = () => {
    const {data,isPending} = authClient.useSession();
    const router = useRouter();
    const isMobile = useIsMobile();

    const onLogOut =  () => {
         authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth/sign-in");
                }
            }
        })
    }

    if(isPending || !data?.user) {
        return null;
    }
    if(isMobile) {
        return(
        <Drawer>
            <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
                    {data.user.image ? (
                        <Avatar>
                            <AvatarImage src={data.user.image}/>
                        </Avatar>
                    ): <GeneratedAvatar seed={data.user.name} variant="initials" className="size-9 mr-3" 
                    />}

                    <div className="flex flex-col gap-0.5 overflow-hidden text-left flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                            {data.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                            {data.user.email || ""}
                        </p>
                    </div>
                    <ChevronDownIcon className="size-4 shrink-0"/>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{data.user.name}</DrawerTitle>
                        <DrawerDescription>{data.user.email || ""}</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button className="cursor-pointer flex items-center justify-between" variant={"outline"} onClick={() =>{}}>
                      Billing 
                      <CreditCardIcon className="size-4 text-black"/>                       
                    </Button>
                    <Button className="cursor-pointer flex items-center justify-between" onClick={onLogOut} variant={"destructive"}>
                      Log Out 
                      <LogOutIcon className="size-4"/>                       
                    </Button>
                    </DrawerFooter>
                </DrawerContent>
        </Drawer>
        )
    }
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
                    {data.user.image ? (
                        <Avatar>
                            <AvatarImage src={data.user.image}/>
                        </Avatar>
                    ): <GeneratedAvatar seed={data.user.name} variant="initials" className="size-9 mr-3" 
                    />}

                    <div className="flex flex-col gap-0.5 overflow-hidden text-left flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                            {data.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                            {data.user.email || ""}
                        </p>
                    </div>
                    <ChevronDownIcon className="size-4 shrink-0"/>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="right" className="w-72">
                    <DropdownMenuLabel>
                        <div className="flex flex-col gap-1">
                            <span className="font-medium truncate">{data.user.name}</span>
                            <span className="text-xs text-muted-foreground">{data.user.email || ""}</span>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
                      Billing 
                      <CreditCardIcon className="size-4"/>                       
                    </DropdownMenuItem >
                    <DropdownMenuItem className="cursor-pointer flex items-center justify-between" onClick={onLogOut}>
                      Log Out 
                      <LogOutIcon className="size-4"/>                       
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </>
    )
}