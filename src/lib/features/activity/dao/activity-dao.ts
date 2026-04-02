import { ApplicationException } from '../../../../lib/types/application-exception.ts';
import { COMMON_ERRORS, INTERNAL_ERROR } from "../../../../lib/types/error-type.ts";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../../../constants.ts";
import { BaseDao } from "../../../database/base-dao.tsx";
import { prismaClient } from "../../../database/prisma-client.ts";
import { calcOffset } from "../../../utils/page-helper.tsx";
import {
    ActivityConditions,
    ActivityItem,
    CreateActivityInput, UpdateActivityInput
} from '../shared/activity.ts';

export class ActivityDao implements BaseDao<ActivityItem, CreateActivityInput, UpdateActivityInput, ActivityConditions> {


    insertObj = async (activity: ActivityItem): Promise<boolean> => {
        try {
            await prismaClient.activity.create({
                data: activity
            })
            return true;
        } catch {
            throw new ApplicationException(INTERNAL_ERROR);
        }
    }

    countByCondition = async (condition: ActivityConditions): Promise<number> => {
        const { page: _page, limit: _limit, ...cleanCondition } = condition ?? {};
        const result = await prismaClient.activity.count({
            where: cleanCondition
        });
        if (result <= 0) {
            throw new ApplicationException(COMMON_ERRORS.NOT_FOUND, '未找到指定数据');
        }
        return result;
    }

    findByCondition = async (condition: ActivityConditions): Promise<{ items: ActivityItem[], totalCount: number }> => {
        const { page: _page, limit, ...cleanCondition } = condition;
        const offset = calcOffset(condition);
        const totalCount = await this.countByCondition(condition);
        const activities = await prismaClient.activity.findMany({
            where: cleanCondition,
            skip: offset,
            take: limit
        })
        return {
            items: activities as ActivityItem[],
            totalCount
        };
    }

    editObj = async (updateActivity: UpdateActivityInput): Promise<boolean> => {
        try {
            await this.countByCondition({ id: updateActivity.id, limit: DEFAULT_LIMIT, page: DEFAULT_PAGE });
            await prismaClient.activity.update({
                where: {
                    id: updateActivity.id
                },
                data: updateActivity
            })
            return true;
        } catch {
            throw new ApplicationException(INTERNAL_ERROR);
        }
    }

    deleteById = async (id: string): Promise<boolean> => {
        try {
            await this.countByCondition({ id: id, limit: DEFAULT_LIMIT, page: DEFAULT_PAGE });
            await prismaClient.activity.delete({
                where: {
                    id: id
                }
            });
            return true;
        } catch {
            throw new ApplicationException(INTERNAL_ERROR);
        }
    }
}