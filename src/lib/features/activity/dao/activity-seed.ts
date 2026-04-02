import { base, en, Faker, zh_CN } from '@faker-js/faker';
import { prismaClient } from "../../../database/prisma-client.ts";
import { getRandomInt } from '../../../utils/random.ts';
import {
    ActivityStatus,
    ActivityTypes
} from '../shared/activity.ts';

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
    await prismaClient.activity.create({
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
            end_time: faker.date.anytime(),
            creator_id: faker.string.uuid()
        }
    });

}

const generatorActivities = async () => {
    const promises = Array.from({ length: 22 }).map(() => createRandomActivity());
    await Promise.all(promises);
};

export const initActivity = async (): Promise<void> => {
    try {
        await prismaClient.activity.deleteMany();
        await generatorActivities();
    } catch (error) {
        console.error(error)
    }
}