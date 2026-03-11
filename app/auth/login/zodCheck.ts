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
    title: z.string().describe('活动标题'), // 改为title而不是name
    start_time: z.string().describe('活动开始时间').optional().refine(
        (val) => !val || !isNaN(Date.parse(val)),
        {message: "Invalid date format"}
    ),
    end_time: z.string().describe('活动结束时间').optional().refine(
        (val) => !val || !isNaN(Date.parse(val)),
        {message: "Invalid date format"}
    ),
    type: z.enum(ActivityTypes).describe('活动类型').optional(), // 改为可选
    status: z.enum(ActivityStatus).describe('活动状态').optional(), // 改为可选
    desc: z.string().optional().describe('描述信息'), // 改为可选
    author: z.string().describe('创建人').optional(), // 改为可选
    content: z.string().describe('活动说明').optional(), // 改为可选
    id: z.string()
})