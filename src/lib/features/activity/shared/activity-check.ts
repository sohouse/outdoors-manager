import z from "zod";
import { ActivityStatus, ActivityTypes } from "./activity.ts";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/lib/constants.ts";

const emptyToUndefined = (value: unknown) => {
    if (value === "" || value == null) {
        return undefined;
    }
    return value;
};

const datetimeInputSchema = z.string().refine(
    (val) => val === "" || !isNaN(Date.parse(val)),
    { message: "Invalid ISO datetime" }
);

export const editActivityCheck = z.object({
    start_time: z.string().describe('活动开始时间').optional().refine(
        (val) => !val || !isNaN(Date.parse(val)),
        { message: "Invalid date format" }
    ),
    end_time: z.string().describe('活动结束时间').optional().refine(
        (val) => !val || !isNaN(Date.parse(val)),
        { message: "Invalid date format" }
    ),
    desc: z.string().optional().describe('描述信息'),
    author: z.string().describe('创建人').optional(),
    content: z.string().describe('活动说明').optional(),
    title: z.string().optional().describe('活动标题'),
    type: z.enum(ActivityTypes).optional().describe('活动类型').default(ActivityTypes.未指定),
    status: z.enum(ActivityStatus).optional().describe('活动状态').default(ActivityStatus.未开始),
    id: z.string()
})

export const insertActivityCheck = z.object({
    leader_id: z.string().optional(),
    content: z.string().describe('活动说明').optional(),
    desc: z.string().optional().describe('描述信息'),
    car_id: z.string().optional(),
    title: z.string().describe('活动标题'),
    author: z.string().describe('创建人'),
    type: z.enum(ActivityTypes).describe('活动类型').default(ActivityTypes.未指定),
    status: z.enum(ActivityStatus).describe('活动状态').default(ActivityStatus.未开始),
    start_time: z.string().describe('活动开始时间').refine(
        (val) => !val || !isNaN(Date.parse(val)),
        { message: "Invalid date format" }
    ),
    end_time: z.string().describe('活动结束时间').refine(
        (val) => !val || !isNaN(Date.parse(val)),
        { message: "Invalid date format" }
    ),
})

export const listActivityCheck = z.object({
    id: z.string(),
    title: z.string().describe('活动标题'),
    type: z.enum(ActivityTypes).describe('活动类型').default(ActivityTypes.未指定),
    status: z.enum(ActivityStatus).describe('活动状态').default(ActivityStatus.未开始),
    start_time: z.string().describe('活动开始时间').refine(
        (val) => !val || !isNaN(Date.parse(val)),
        { message: "Invalid date format" }
    ),
    end_time: z.string().describe('活动结束时间').refine(
        (val) => !val || !isNaN(Date.parse(val)),
        { message: "Invalid date format" }
    ),
    create_time: z.string().describe('活动创建时间').refine(
        (val) => !val || !isNaN(Date.parse(val)),
        { message: "Invalid date format" }
    ),
    author: z.string().describe('活动创建人'),
    content: z.string().describe('活动说明').optional(),
    car_No: z.string().describe('车牌号').optional(),
    leader_name: z.string().describe('活动领队').optional(),
    desc: z.string().describe('描述信息').optional(),

})

export const activityConditionCheck = z.object({
    page: z.coerce.number().optional().default(DEFAULT_PAGE).describe('page number'),
    limit: z.coerce.number().optional().default(DEFAULT_LIMIT).describe('page size'),
    id: z.preprocess(emptyToUndefined, z.string().optional()).describe('activity id'),
    leader_name: z.preprocess(emptyToUndefined, z.string().optional()).describe('leader\'s name'),
    author: z.preprocess(emptyToUndefined, z.string().optional()).describe('author'),
    title: z.preprocess(emptyToUndefined, z.string().optional()).describe('activity title'),
    type: z.preprocess((value) => {
        const normalized = emptyToUndefined(value);
        return normalized == null ? undefined : Number(normalized);
    }, z.enum(ActivityTypes).optional()).describe('activity type'),
    status: z.preprocess((value) => {
        const normalized = emptyToUndefined(value);
        return normalized == null ? undefined : Number(normalized);
    }, z.enum(ActivityStatus).optional()).describe('activity status'),
    start_time: z.preprocess(emptyToUndefined, datetimeInputSchema.optional()).describe('activity start time'),
    end_time: z.preprocess(emptyToUndefined, datetimeInputSchema.optional()).describe('activity start time'),
    car_id: z.preprocess(emptyToUndefined, z.string().optional()).describe('bus license plate')
})

export const activityById = z.object({
    id: z.string().describe('activity id')
})

export const paginateMetaSchema = z.object({
    totalCount: z.number(),
    limit: z.number(),
    totalPage: z.number(),
    page: z.number(),
});

export const pageResultSchema = <T extends z.ZodType>(itemSchema: T) =>
    z.object({
        meta: paginateMetaSchema,
        items: z.array(itemSchema)
    })

export const activityVOSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(ActivityTypes),
  status: z.enum(ActivityStatus),
  start_time: z.string(),
  end_time: z.string(),
  create_time: z.string(),
  author: z.string(),
  content: z.string().optional(),
  car_No: z.string().optional(),
  leader_name: z.string().optional(),
  desc: z.string().optional(),
  creator_id: z.string().optional(),
});

export const activityPageResponseSchema = pageResultSchema(activityVOSchema);
