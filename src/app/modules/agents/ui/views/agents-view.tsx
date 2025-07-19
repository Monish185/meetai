"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditIcon, Trash2Icon, BotIcon } from "lucide-react";
import GeneratedAvatar from "@/components/generated-avatar";
import { formatDistanceToNow } from "date-fns";

export const AgentsView = () => {
    const trpc = useTRPC();

    const {data: agents} = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    if (!agents || agents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                <BotIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No agents yet</h3>
                <p className="text-muted-foreground mb-4">
                    Create your first agent to get started with AI assistance.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-8">
            {agents.map((agent) => (
                <Card key={agent.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                            <GeneratedAvatar 
                                seed={agent.name}
                                variant="botttsNeutral"
                                className="border size-10"
                            />
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-base truncate">
                                    {agent.name}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Created {formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true })}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                            {agent.instructions}
                        </p>
                        <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                                Active
                            </Badge>
                            <div className="flex gap-1">
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-8 w-8 p-0"
                                >
                                    <EditIcon className="h-4 w-4" />
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                    <Trash2Icon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}