import { ActivityStatus, ActivityTypes } from "@/types/activity";
import * as z from "zod";

export const signUpCheck = z.object({
    name: z
        .string()
        .min(5, 'name must be at least 5 characters.'),

    email: z
        .email(),

    pwd: z
        .string()
        .min(8, 'password must be at least 8 characters.')
        .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, 'must include letter and number.')
})

export const editActivityCheck = z.object({
    name: z.string(),
    start_time: z.string().optional().refine(
        (val) => !val || !isNaN(Date.parse(val)),
        {message: "Invalid date format"}
    ),
    end_time: z.string().optional().refine(
        (val) => !val || !isNaN(Date.parse(val)),
        {message: "Invalid date format"}
    ),
    type: z.enum(ActivityTypes),
    status: z.enum(ActivityStatus),
    desc: z.string(),
    author: z.string(),
    content: z.string(),
    id: z.string()
})