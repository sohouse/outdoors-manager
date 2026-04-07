import { PaginateCondition } from "../../../types/pagination.ts";
import {DEFAULT_LIMIT, DEFAULT_PAGE} from "../../../../lib/constants.ts";
import { Prisma } from "@prisma/client";

export enum ActivityTypes {
    未指定 = 0,
    徒步= 1,
    攀岩= 2,
    攻防箭= 3,
    体能训练= 4,
    攀冰= 5,
}

export enum ActivityStatus {
    未开始= 0,
    报名中= 1,
    进行中= 2,
    已结束= 3,
    已取消= 4,
}

/**
 * 活动检索对象
 */
export class ActivityConditions implements PaginateCondition {
    page: number = DEFAULT_PAGE;
    limit: number = DEFAULT_LIMIT;
    // 活动id
    id?: string = undefined;
    // 活动领队名称
    leader_name?: string = undefined;
    // 活动标题
    title?: string = undefined;
    // 活动类型
    type?: ActivityTypes = undefined;
    // 活动状态
    status?: ActivityStatus = undefined;
    // 开始时间
    start_time?: Date = undefined;
    // 结束时间
    end_time?: Date = undefined;
    // 车辆牌照
    car_id?: string = undefined;
}

/**
 * 活动展示对象
 */
export interface ActivityItem {
    // 活动id
    id: string;
    // 活动领队名称
    leader_name?: string;
    // 活动描述
    desc?: string;
    // 活动标题
    title: string,
    // 活动类型
    type: ActivityTypes;
    // 活动状态
    status: ActivityStatus;
    // 开始时间
    start_time:Date;
    // 结束时间
    end_time:Date;
    // 活动内容
    content?: string;
    // 车辆牌照
    car_No?: string;
    // 活动创建时间
    create_time: Date;
    // 活动创建人
    author: string;
    // 活动创建者id
    creator_id?: string;
}

type DateToString<T> = {
    [K in keyof T]: T[K] extends Date ? string : T[K]
}

export type ActivityVO = DateToString<ActivityItem>;

export function toActivityVO(item: ActivityItem): ActivityVO {
    return {
        ...item,
        start_time: item.start_time instanceof Date ? item.start_time.toISOString() : item.start_time,
        end_time: item.end_time instanceof Date ? item.end_time.toISOString() : item.end_time,
        create_time: item.create_time instanceof Date ? item.create_time.toISOString() : item.create_time,
    }
}

/**
 * 活动新增对象
 */
export interface CreateActivityInput {
    // 活动领队名称
    leader_id?: string;
    // 活动内容
    content?: string;
    // 活动描述
    desc?: string;
    // 车辆牌照
    car_id?: string;
    // 活动标题
    title: string,
    // 活动创建人
    author: string;
    // 活动类型
    type: ActivityTypes;
    // 活动状态
    status: ActivityStatus;
    // 开始时间
    start_time:Date;
    // 结束时间
    end_time:Date;
}

/**
 * 更新活动对象
 */
export interface UpdateActivityInput {
    // 活动id
    id: string;
    // 活动领队名称
    leader_id?: string;
    // 活动内容
    content?: string;
    // 活动描述
    desc?: string;
    // 车辆牌照
    car_id?: string;
    // 活动标题
    title?: string,
    // 活动创建人
    author?: string;
    // 活动类型
    type?: ActivityTypes;
    // 活动状态
    status?: ActivityStatus;
    // 开始时间
    start_time?:Date;
    // 结束时间
    end_time?:Date;
}

export interface DaoFindResult<T> {
    totalCount: number;
    items: T[]
}

export type ActivityRecord = Prisma.ActivityGetPayload<{select: null}>