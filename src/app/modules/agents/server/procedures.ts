import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema, agentsUpdateSchema } from "../schemas";
import z from "zod";
import { eq, getTableColumns, desc, sql, and, ilike, count } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/contants";

export const agentsRouter = createTRPCRouter({

    update: protectedProcedure.input(agentsUpdateSchema).mutation(async({ctx,input}) => {
        const [updatedAgent] = await db
        .update(agents)
        .set({
            name: input.name,
            instructions: input.instructions,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(agents.id, input.id),
                eq(agents.userId, ctx.auth.user.id)
            )
        )
        .returning();

        if (!updatedAgent) {
            throw new TRPCError({code: "NOT_FOUND", message: "Agent not found"});
        }

        return updatedAgent;
    }),

    remove: protectedProcedure.input(z.object({id: z.string()})).mutation(async({ctx,input}) => {
        const [removedAgent] = await db
        .delete(agents)
        .where(
            and(
                eq(agents.id, input.id),
                eq(agents.userId, ctx.auth.user.id)
            )
        )
        .returning();

        if (!removedAgent) {
            throw new TRPCError({code: "NOT_FOUND", message: "Agent not found"});
        }

        return removedAgent;
    }),

    getMany: protectedProcedure
    .input(
        z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
            .number()
            .min(MIN_PAGE_SIZE)
            .max(MAX_PAGE_SIZE)
            .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),    
    }))

    .query(async ({ctx, input}) => {
        const {page, pageSize, search} = input;
        const userAgents = await db
            .select({
                meetingCount: sql<number>`5`,
                ...getTableColumns(agents)
            })
            .from(agents)
            .where(
                and(
                    eq(agents.userId, ctx.auth.user.id),
                    search ? ilike(agents.name, `%${search}%`) : undefined
                )
                )
            .orderBy(desc(agents.createdAt),desc(agents.id))
            .limit(pageSize)
            .offset((page - 1) * pageSize);

            const [totalCount] = await db
            .select({count: count()})
            .from(agents)
            .where(
                and(
                    eq(agents.userId, ctx.auth.user.id),
                    search ? ilike(agents.name, `%${search}%`) : undefined
                )
            );
            const totalPages = Math.ceil(totalCount.count / pageSize);
        return {
            items: userAgents,
            total: totalCount.count,
            totalPages,
        };
    }),

    getOne: protectedProcedure.input(z.object({id: z.string()})).query(async ({ctx,input}) => {
        const [existingAgents] = await db
            .select({
                meetingCount: sql<number>`5`,
                ...getTableColumns(agents)
            })
            .from(agents)
            .where(
                and(
                eq(agents.id, input.id),
                eq(agents.userId, ctx.auth.user.id)
                )
            );
        if (!existingAgents) {
            throw new TRPCError({code: "NOT_FOUND", message: "Agent not found"});
        }
    
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

})