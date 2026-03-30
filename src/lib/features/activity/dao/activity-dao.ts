import {
    ActivityConditions,
    ActivityItem,
    ActivityStatus,
    ActivityTypes,
    CreateActivityInput, UpdateActivityInput
} from '../shared/activity.ts';
import {getRandomInt} from '../../../utils/random.ts';
import {base, en, Faker, zh_CN} from '@faker-js/faker';
import {client} from "../../../database/client.ts"
import {BaseDao} from "../../../database/BaseDao.tsx";
import {DEFAULT_LIMIT, DEFAULT_PAGE} from "../../../constants.ts";
import {calcOffset} from "../../../utils/page-helper.tsx";
import {ApplicationException} from "@/lib/types/ApplicationException.ts";
import {COMMON_ERRORS, INTERNAL_ERROR} from "@/lib/types/ErrorType.ts";

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
            title: faker.lorem.paragraph({min: 1, max: 3}),
            content: faker.lorem.paragraphs(getRandomInt(3, 6), '\n'),
            author: faker.person.fullName(),
            create_time: faker.date.anytime(),
            leader_id: faker.string.uuid(),
            type: faker.helpers.arrayElement(activityTypesFilter),
            desc: faker.lorem.paragraph({min: 5, max: 7}),
            status: faker.helpers.arrayElement(activityStatueFilter),
            start_time: faker.date.anytime(),
            end_time: faker.date.anytime()
        }
    });

}

const generatorActivities = async () => {
    const promises = Array.from({length: 22}).map(() => createRandomActivity());
    await Promise.all(promises);
};

export const initActivity = async (): Promise<void> => {
    try {
        await client.activity.deleteMany();
        await generatorActivities();
    } catch {
        throw new ApplicationException(INTERNAL_ERROR);
    }
}

export class ActivityDao implements BaseDao<ActivityItem, CreateActivityInput, UpdateActivityInput, ActivityConditions> {


    insertObj = async (activity: ActivityItem): Promise<boolean> => {
        try {
            await client.activity.create({
                data: activity
            })
            return true;
        } catch {
            throw new ApplicationException(INTERNAL_ERROR);
        }
    }

    countByCondition = async (condition: ActivityConditions): Promise<number> => {
        const {page: _page, limit: _limit, ...cleanCondition} = condition ?? {};
        const result = await client.activity.count({
            where: cleanCondition
        });
        if (result <= 0) {
            throw new ApplicationException(COMMON_ERRORS.NOT_FOUND, '未找到指定数据');
        }
        return result;
    }

    findByCondition = async (condition: ActivityConditions): Promise<{ items: ActivityItem[], totalCount: number }> => {
        const {page: _page, limit, ...cleanCondition} = condition;
        const offset = calcOffset(condition);
        const totalCount = await this.countByCondition(condition);
        const activities = await client.activity.findMany({
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
            await this.countByCondition({id: updateActivity.id, limit: DEFAULT_LIMIT, page: DEFAULT_PAGE});
            await client.activity.update({
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
            await this.countByCondition({id: id, limit: DEFAULT_LIMIT, page: DEFAULT_PAGE});
            await client.activity.delete({
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