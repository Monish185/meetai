import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema } from "../schemas";
import z from "zod";
import { eq, getTableColumns, desc, sql, and, ilike, count } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/contants";

export const agentsRouter = createTRPCRouter({
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

    getOne: protectedProcedure.input(z.object({id: z.string()})).query(async ({input}) => {
        const [existingAgents] = await db
            .select({
                ...getTableColumns(agents)
            })
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