import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import { agentsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import GeneratedAvatar from "@/components/generated-avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


interface NewAgentForm{
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne;
}

export const AgentForm = ({onSuccess, onCancel, initialValues}: NewAgentForm) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient()

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({})
                )
                onSuccess?.()
            },
            onError: (error) =>{
                toast.error(error.message || "Failed to create agent")
            }
        })
    )
    const updateAgent = useMutation(
        trpc.agents.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({})
                )
                if(initialValues?.id){
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({id: initialValues.id})
                    )
                }
                onSuccess?.()
            },
            onError: (error) =>{
                toast.error(error.message || "Failed to create agent")
            }
        })
    )

    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValues?.name || "",
            instructions: initialValues?.instructions || "",
        },
    });

    const isEdit = !!initialValues?.id;
    const isPending = createAgent.isPending || updateAgent.isPending;

    const onSubmit = (data: z.infer<typeof agentsInsertSchema>) => {
        if(isEdit){
            updateAgent.mutate({
                id: initialValues.id,
                name: data.name,
                instructions: data.instructions,
            })
            console.log(data,"data in isEdit")
        }else{
            createAgent.mutate(data)
        }
    }
    return (
        <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col gap-y-4 m-2">
                <GeneratedAvatar 
                    seed={form.watch("name")}
                    variant="botttsNeutral"
                    className="border size-16"
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="instructions"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea {...field} className="min-h-[100px]" placeholder="Enter detailed instructions for your agent..." />
                            </FormControl>
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
                        {isPending ? "Saving..." : (isEdit ? "Update Agent" : "Create Agent")}
                    </Button>
                    
                </div>
            </form>
        </Form>
        </>
    )
}
