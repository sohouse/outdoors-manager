import z from "zod";
import { ActivityStatus, ActivityTypes } from "../types/activity.ts";

export const editActivityCheck = z.object({
    start_time: z.string().describe('活动开始时间').optional().refine(
        (val) => !val || !isNaN(Date.parse(val)),
        {message: "Invalid date format"}
    ),
    end_time: z.string().describe('活动结束时间').optional().refine(
        (val) => !val || !isNaN(Date.parse(val)),
        {message: "Invalid date format"}
    ),
    desc: z.string().optional().describe('描述信息'),
    author: z.string().describe('创建人').optional(),
    content: z.string().describe('活动说明').optional(),
    title: z.string().optional().describe('活动标题'), // 改为title而不是name
    type: z.enum(ActivityTypes).optional().describe('活动类型').default(ActivityTypes.未指定),
    status: z.enum(ActivityStatus).optional().describe('活动状态').default(ActivityStatus.未开始),
    id: z.string()
})

export const listActivityCheck = z.object({
    id: z.string(),
    title: z.string().describe('活动标题'),
    type: z.enum(ActivityTypes).describe('活动类型').default(ActivityTypes.未指定),
    status: z.enum(ActivityStatus).describe('活动状态').default(ActivityStatus.未开始),
    start_time: z.string().describe('活动开始时间').refine(
        (val) => !val || !isNaN(Date.parse(val)),
        {message: "Invalid date format"}
    ),
    end_time: z.string().describe('活动结束时间').refine(
        (val) => !val || !isNaN(Date.parse(val)),
        {message: "Invalid date format"}
    ),
    create_time: z.string().describe('活动创建时间').refine(
        (val) => !val || !isNaN(Date.parse(val)),
        {message: "Invalid date format"}
    ),
    author: z.string().describe('活动创建人'),
    content: z.string().describe('活动说明').optional(),
    car_No: z.string().describe('车牌号').optional(),
    leader_name: z.string().describe('活动领队').optional(),
    desc: z.string().describe('描述信息').optional(),
    
})
