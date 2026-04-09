import z from 'zod';
import { ApplicationException } from '../../../../lib/types/application-exception.ts';
import { COMMON_RESPONSE, INTERNAL_ERROR } from "../../../../lib/types/error-type.ts";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../../../constants.ts";
import { BaseDao } from "../../../database/base-dao.tsx";
import { prismaClient } from "../../../database/prisma-client.ts";
import { calcOffset } from "../../../utils/page-helper.tsx";
import { activityConditionCheck, editActivityCheck, insertActivityCheck } from '../shared/activity-check.ts';
import {
    DaoFindResult,
    ActivityItem,
} from '../shared/activity.ts';
import { toActivityDomainList } from './activity-mapper.ts';

const buildActivityWhere = (condition: z.infer<typeof activityConditionCheck>) => {
    const { page: _page, limit: _limit, ...cleanCondition } = condition ?? {};
    const title = cleanCondition.title?.trim();
    const author = cleanCondition.author?.trim();

    return {
        ...(title
            ? {
                title: {
                    contains: title,
                    mode: 'insensitive' as const,
                },
            }
            : {}),
        ...(cleanCondition.type !== undefined
            ? { type: cleanCondition.type }
            : {}),
        ...(cleanCondition.id !== undefined
            ? { id: cleanCondition.id }
            : {}),
        ...(author
            ? { author }
            : {}),
        ...(cleanCondition.status !== undefined
            ? { status: cleanCondition.status }
            : {}),
        ...(cleanCondition.start_time
            ? {
                start_time: {
                    gte: new Date(cleanCondition.start_time),
                },
            }
            : {}),
        ...(cleanCondition.end_time
            ? {
                end_time: {
                    lte: new Date(cleanCondition.end_time),
                },
            }
            : {}),
    };
};

export class ActivityDao implements BaseDao<ActivityItem, z.infer<typeof insertActivityCheck>, z.infer<typeof editActivityCheck>, z.infer<typeof activityConditionCheck>> {

    insertObj = async (activity: z.infer<typeof insertActivityCheck>): Promise<boolean> => {
        try {
            await prismaClient.activity.create({
                data: activity
            })
            return true;
        } catch (error) {
            if (error instanceof ApplicationException) {
                throw error;
            }
            throw new ApplicationException(INTERNAL_ERROR);
        }
    }

    countByCondition = async (condition: z.infer<typeof activityConditionCheck>): Promise<number> => {
        const result = await prismaClient.activity.count({
            where: buildActivityWhere(condition)
        });
        return result;
    }

    findByCondition = async (condition: z.infer<typeof activityConditionCheck>): Promise<DaoFindResult<ActivityItem>> => {
        const { limit } = condition;
        const offset = calcOffset(condition);
        const totalCount = await this.countByCondition(condition);
        const activities = await prismaClient.activity.findMany({
            where: buildActivityWhere(condition),
            skip: offset,
            take: limit
        })
        return {
            items: toActivityDomainList(activities),
            totalCount
        };
    }

    editObj = async (updateActivity: z.infer<typeof editActivityCheck>): Promise<boolean> => {
        try {
            const count = await this.countByCondition({ id: updateActivity.id, limit: DEFAULT_LIMIT, page: DEFAULT_PAGE });
            if (count <= 0) {
                throw new ApplicationException(COMMON_RESPONSE.NOT_FOUND, '未找到指定数据');
            }
            await prismaClient.activity.update({
                where: {
                    id: updateActivity.id
                },
                data: updateActivity
            })
            return true;
        } catch (error) {
            if (error instanceof ApplicationException) {
                throw error;
            }
            throw new ApplicationException(INTERNAL_ERROR);
        }
    }

    deleteById = async (id: string): Promise<boolean> => {
        try {
            const count = await this.countByCondition({ id: id, limit: DEFAULT_LIMIT, page: DEFAULT_PAGE });
            if (count <= 0) {
                throw new ApplicationException(COMMON_RESPONSE.NOT_FOUND, '未找到指定数据');
            }
            await prismaClient.activity.delete({
                where: {
                    id: id
                }
            });
            return true;
        } catch (error) {
            if (error instanceof ApplicationException) {
                throw error;
            }
            throw new ApplicationException(INTERNAL_ERROR);
        }
    }
}
