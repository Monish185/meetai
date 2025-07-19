import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema } from "../schemas";
import z from "zod";
import { eq } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
    getMany: protectedProcedure.query(async ({ctx}) => {
        const userAgents = await db
            .select()
            .from(agents)
        return userAgents;
    }),

    getOne: protectedProcedure.input(z.object({id: z.string()})).query(async ({input}) => {
        const [existingAgents] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, input.id))
        // throw new TRPCError({code: "BAD_REQUEST"})
        return existingAgents;
    }),

    create: protectedProcedure.input(agentsInsertSchema).mutation(async({ctx,input}) => {
        const [createdAgent] = await db
        .insert(agents)
        .values({
            ...input,
            userId: ctx.auth.user.id,
        })
        .returning();

        return createdAgent;
    }),

    update: protectedProcedure.input(z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required"),
        instructions: z.string().min(10, "Instructions must be at least 10 characters long"),
    })).mutation(async({ctx,input}) => {
        const [updatedAgent] = await db
        .update(agents)
        .set({
            name: input.name,
            instructions: input.instructions,
            updatedAt: new Date(),
        })
        .where(eq(agents.id, input.id))
        .returning();

        return updatedAgent;
    })
})