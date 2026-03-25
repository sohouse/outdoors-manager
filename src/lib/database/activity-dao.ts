import {
    ActivityConditions,
    ActivityItem,
    ActivityStatus,
    ActivityTypes,
    CreateActivityInput, UpdateActivityInput
} from '../types/activity.ts';
import { getRandomInt } from '../utils/random.ts';
import { base, en, Faker, zh_CN } from '@faker-js/faker';
import { client } from "./client.ts"
import { BaseDao } from "./IDao.tsx";
import {DEFAULT_LIMIT, DEFAULT_PAGE} from "../constants.ts";
import {calcOffset} from "../utils/page-helper.tsx";

const faker = new Faker({
    locale: [zh_CN, en, base]
});

const activityTypesFilter = Object.values(ActivityTypes).filter(
    (value): value is ActivityTypes => typeof value === 'number'
);
const activityStatueFilter = Object.values(ActivityStatus).filter(
    (value): value is ActivityStatus => typeof value === 'number'
);

const createRandomActivity = async () => {
    await client.activity.create({
        data: {
            title: faker.lorem.paragraph({ min: 1, max: 3 }),
            content: faker.lorem.paragraphs(getRandomInt(3, 6), '\n'),
            author: faker.person.fullName(),
            create_time: faker.date.anytime(),
            leader_id: faker.string.uuid(),
            type: faker.helpers.arrayElement(activityTypesFilter),
            desc: faker.lorem.paragraph({ min: 5, max: 7 }),
            status: faker.helpers.arrayElement(activityStatueFilter),
            start_time: faker.date.anytime(),
            end_time: faker.date.anytime()
        }
    });

}

const generatorActivities = async () => {
    const promises = Array.from({ length: 22 }).map(() => createRandomActivity());
    await Promise.all(promises);
};

export const initActivity = async (): Promise<void> => {
    try {
        await client.activity.deleteMany();
        await generatorActivities();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export class ActivityDao implements BaseDao<ActivityItem, CreateActivityInput, UpdateActivityInput, ActivityConditions> {


    insertObj = async (activity: ActivityItem): Promise<boolean> => {
        try {
            await client.activity.create({
                data: activity
            })
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    countByCondition = async (condition: ActivityConditions): Promise<number> => {
        const { page: _page, limit: _limit, ...cleanCondition } = condition ?? {};
        return client.activity.count({
            where: cleanCondition
        });
    }

    findByCondition = async (condition: ActivityConditions): Promise<{ items: ActivityItem[], totalCount: number }> => {
        const { page: _page, limit, ...cleanCondition } = condition;
        const offset = calcOffset(condition);
        const activities = await client.activity.findMany({
            where: cleanCondition,
            skip: offset,
            take: limit
        })
        // 转换为 Activity 类型
        const mappedActivities = activities.map(activity => ({
            id: activity.id,
            content: activity.content || undefined,
            author: activity.author || undefined,
            create_time: activity.create_time || undefined,
            title: activity.title || undefined,
            leader_id: activity.leader_id || undefined,
            type: activity.type || undefined,
            desc: activity.desc || undefined,
            status: activity.status || undefined,
            start_time: activity.start_time || undefined,
            end_time: activity.end_time || undefined
        }));

        if (!Array.isArray(mappedActivities)) {
            throw new Error('读取数据失败');
        }
        const totalCount = await this.countByCondition(condition);
        return {
            items: mappedActivities as ActivityItem[],
            totalCount
        };
    }

    // todo 完成修改逻辑
    editObj = async (updateActivity: UpdateActivityInput): Promise<boolean> => {
        const {items} = await this.findByCondition({ id: updateActivity.id, limit: DEFAULT_LIMIT, page: DEFAULT_PAGE });
        if (!Array.isArray(items)) {
            throw new Error('读取数据失败');
        }
        try {
            await client.activity.update({
                where: {
                    id: updateActivity.id
                },
                data: updateActivity
            })
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    deleteById = async (id: string): Promise<boolean> => {
        try {
            const {items} = await this.findByCondition({ id: id, limit: DEFAULT_LIMIT, page: DEFAULT_PAGE }) || [];
            if (items.length > 0) {
                await client.activity.delete({
                    where: {
                        id: id
                    }
                });
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}