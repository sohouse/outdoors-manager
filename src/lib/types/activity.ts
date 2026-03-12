import { PaginateCondition } from "./pagination.ts";

/**
 * 活动展示对象
 */
export interface Activity {
    // 活动id
    id: string;
    // 活动内容
    content?: string;
    // 活动创建人
    author?: string;
    // 活动创建时间
    create_time?: Date;
    // 活动标题
    title: string,
    // 活动领队id
    leader_id?: string;
    // 车辆id
    car_id?: string;
    // 活动首图
    thumb?: string;
    // 活动描述
    desc?: string;
    // 活动类型
    type: ActivityTypes;
    // 活动状态
    status: ActivityStatus;
    // 开始时间
    start_time?:Date;
    // 结束时间
    end_time?:Date;
    // 活动物资
    material?: [{
        id: string;
        status: number
    }]
}

/**
 * 活动查询对象
 */
export interface ActivityCondition extends PaginateCondition {
    // 活动id
    id?: string;
    // 活动创建人
    author?: string;
    // 活动创建时间
    create_time?: Date;
    // 活动领队id
    leader_id?: string;
    // 车辆id
    car_id?: string;
    // 活动类型
    type?: ActivityTypes;
    // 活动状态
    status?: ActivityStatus;
    // 开始时间
    start_time?:Date;
    // 结束时间
    end_time?:Date;
}

export enum ActivityTypes {
    徒步= 1,
    攀岩= 2,
    攻防箭= 3,
    体能训练= 4,
    攀冰= 5,
};

export enum ActivityStatus {
    未开始= 0,
    报名中= 1,
    进行中= 2,
    已结束= 3,
    已取消= 4,
};
