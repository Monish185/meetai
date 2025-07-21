import { useTRPC } from "@/trpc/client";
import { MeetingGetOne } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { meetingsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import GeneratedAvatar from "@/components/generated-avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { NewAgentDialog } from "@/app/modules/agents/ui/components/new-agent-dialog";



interface NewMeetingForm{
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne;
}

export const MeetingForm = ({onSuccess, onCancel, initialValues}: NewMeetingForm) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient()

    const [agentSearch, setAgentSearch] = useState("");
    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);

    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            search: agentSearch,
            pageSize: 100,
        })
    )

    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({})
                )
                onSuccess?.(data.id)
            },
            onError: (error) =>{
                toast.error(error.message || "Failed to create meeting")
            }
        })
    )
    const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({})
                )
                if(initialValues?.id){
                    await queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({id: initialValues.id})
                    )
                }
                onSuccess?.(data.id)
            },
            onError: (error) =>{
                toast.error(error.message || "Failed to update meeting")
            }
        })
    )

    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initialValues?.name || "",
            agentId: initialValues?.agentId || "",
        },
    });

    const isEdit = !!initialValues?.id;
    const isPending = createMeeting.isPending || updateMeeting.isPending;

    const onSubmit = (data: z.infer<typeof meetingsInsertSchema>) => {
        if(isEdit){
            updateMeeting.mutate({
                id: initialValues.id,
                ...data,
            })
            console.log(data,"data in isEdit")
        }else{
            createMeeting.mutate(data)
        }
    }
    return (
        <>
        <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col gap-y-4 m-2">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g. Maths consultation" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="agentId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Agent</FormLabel>
                            <FormControl>
                                <CommandSelect
                                    options={(agents.data?.items ?? []).map((agent) => ({
                                        id: agent.id,
                                        value: agent.id,
                                        children: (
                                            <div className="flex items-center gap-x-2">
                                                <GeneratedAvatar 
                                                    seed={agent.name} 
                                                    variant="botttsNeutral" 
                                                    className="border size-6" 
                                                />
                                                <span>{agent.name}</span>
                                            </div>
                                        )
                                    }))}
                                    onSelect={(value) => {
                                        field.onChange(value);
                                    }}
                                    onSearch={(value) => setAgentSearch(value)}
                                    value={field.value}
                                    isSearchable
                                    placeholder="Select an agent"
                                    className="w-full"
                                />
                            </FormControl>
                            <FormDescription>
                                Not found what you&apos;re looking for?{" "}
                                <button
                                    type="button"
                                    onClick={() => setOpenNewAgentDialog(true)}
                                    className="text-primary hover:underline"
                                >
                                    Create new agent
                                </button>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-between gap-2">
                    {onCancel &&(
                        <Button
                        variant="destructive"
                        disabled={isPending}
                        type="button"
                        onClick={onCancel}
                        >
                        Cancel
                    </Button>
                    )}
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : (isEdit ? "Update Meeting" : "Create Meeting")}
                    </Button>
                    
                </div>
            </form>
        </Form>
        </>
    )
}
