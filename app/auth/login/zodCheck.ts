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
    title: z.string(), // 改为title而不是name
    start_time: z.string().optional().refine(
        (val) => !val || !isNaN(Date.parse(val)),
        {message: "Invalid date format"}
    ),
    end_time: z.string().optional().refine(
        (val) => !val || !isNaN(Date.parse(val)),
        {message: "Invalid date format"}
    ),
    type: z.enum(ActivityTypes).optional(), // 改为可选
    status: z.enum(ActivityStatus).optional(), // 改为可选
    desc: z.string().optional(), // 改为可选
    author: z.string().optional(), // 改为可选
    content: z.string().optional(), // 改为可选
    id: z.string()
})