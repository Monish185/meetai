import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { eq, getTableColumns, desc, and, ilike, count, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/contants";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { MeetingStatus } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { generateAvatarUri } from "@/lib/avatar";


export const meetingsRouter = createTRPCRouter({

    generateToken: protectedProcedure.mutation(async ({ctx}) => {
        await streamVideo.upsertUsers([
            {
                id: ctx.auth.user.id,
                name: ctx.auth.user.name,
                role: "admin",
                image:
                    ctx.auth.user.image ??
                    generateAvatarUri({seed: ctx.auth.user.name, variant: "initials"})               
            }
        ])

        const expirationTime = Math.floor(Date.now() / 1000) + 3600;
        const issuedAt = Math.floor(Date.now() / 1000) - 60; 
        
        const token = streamVideo.generateUserToken({
            user_id: ctx.auth.user.id,
            exp: expirationTime,
            iat: issuedAt,
        });

        return token;
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
        agentId: z.string().nullish(),
        status: z.enum([
            MeetingStatus.Upcoming,
            MeetingStatus.Active,
            MeetingStatus.Completed,
            MeetingStatus.Processing,
            MeetingStatus.Cancelled,
            MeetingStatus.CancelledByUser,
            MeetingStatus.CancelledByAgent
        ]).nullish(),
    }))

    .query(async ({ctx, input}) => {
        const {page, pageSize, search, agentId, status} = input;
        const userMeetings = await db
            .select({
                ...getTableColumns(meetings),
                agent: agents,
                duration: sql<string>`EXTRACT(EPOCH FROM (ended_at -started_at))`.as("duration"),
            })
            .from(meetings)
            .innerJoin(agents, eq(meetings.agentId, agents.id))
            .where(
                and(
                    eq(meetings.userId, ctx.auth.user.id),
                    search ? ilike(meetings.name, `%${search}%`) : undefined,
                    agentId ? eq(meetings.agentId, agentId) : undefined,
                    status ? eq(meetings.status, status) : undefined
                )
                )
            .orderBy(desc(meetings.createdAt),desc(meetings.id))
            .limit(pageSize)
            .offset((page - 1) * pageSize);

            const [totalCount] = await db
            .select({count: count()})
            .from(meetings)
            .innerJoin(agents, eq(meetings.agentId, agents.id)) 
            .where(
                and(
                    eq(meetings.userId, ctx.auth.user.id),
                    search ? ilike(meetings.name, `%${search}%`) : undefined,
                    agentId ? eq(meetings.agentId, agentId) : undefined,
                    status ? eq(meetings.status, status) : undefined
                )
            );
            const totalPages = Math.ceil(totalCount.count / pageSize);
        return {
            items: userMeetings,
            total: totalCount.count,
            totalPages,
        };
    }),

    getOne: protectedProcedure.input(z.object({id: z.string()})).query(async ({ctx,input}) => {
        const [existingMeetings] = await db
            .select({
                ...getTableColumns(meetings),
                agent: agents,
                duration: sql<string>`EXTRACT(EPOCH FROM (ended_at -started_at))`.as("duration"),
            })
            .from(meetings)
            .innerJoin(agents, eq(meetings.agentId, agents.id))
            .where(
                and(
                eq(meetings.id, input.id),
                eq(meetings.userId, ctx.auth.user.id)
                )
            );
        if (!existingMeetings) {
            throw new TRPCError({code: "NOT_FOUND", message: "Meeting not found"});
        }
    
        return existingMeetings;
    }),

    create: protectedProcedure.input(meetingsInsertSchema).mutation(async({ctx,input}) => {
        const [createdMeeting] = await db
        .insert(meetings)
        .values({
            ...input,
            userId: ctx.auth.user.id,
        })
        .returning();

        const call = streamVideo.video.call("default",createdMeeting.id);
        await call.create({
            data:{
                created_by_id: ctx.auth.user.id,
                custom:{
                    meetingId: createdMeeting.id,
                    meetingName: createdMeeting.name,
                },
                settings_override: {
                    transcription: {
                        language: "en",
                        mode: "auto-on",
                        closed_caption_mode: "auto-on",

                    },
                    recording: {
                        mode: "auto-on",
                        quality: "1080p",
                    },
                },
            },
        })

            const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, createdMeeting.agentId));

            if (!existingAgent) {
                throw new TRPCError({code: "NOT_FOUND", message: "Agent not found"});
            }

            await streamVideo.upsertUsers([
                {
                    id: existingAgent.id,
                    name: existingAgent.name,
                    role: "user",
                    image: generateAvatarUri({seed: existingAgent.name, variant: "botttsNeutral"}),
                }
            ])

            return createdMeeting;
    }),

    update: protectedProcedure.input(meetingsUpdateSchema).mutation(async({ctx,input}) => {
        const [updatedMeeting] = await db
        .update(meetings)
        .set(input)
        .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)))
        .returning();
        if (!updatedMeeting) {
            throw new TRPCError({code: "NOT_FOUND", message: "Meeting not found"});
        }
        return updatedMeeting;
    }),

    remove: protectedProcedure.input(z.object({id: z.string()})).mutation(async({ctx,input}) => {
        const [deletedMeeting] = await db
        .delete(meetings)
        .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)))
        .returning();
        if (!deletedMeeting) {
            throw new TRPCError({code: "NOT_FOUND", message: "Meeting not found"});
        }
        return deletedMeeting;
    }),

})