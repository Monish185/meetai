import z from "zod";

export const agentsInsertSchema = z.object({
    name: z.string().min(1, "Name is required"),
    instructions: z.string().min(10, "Instructions must be at least 10 characters long"),
});