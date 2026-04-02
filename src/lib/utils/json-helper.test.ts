import { expect, test } from 'vitest';

import { createFilter } from './json-helper.ts';

type Activity = {
    id: string;
    status: 'draft' | 'published';
    tags: string[];
};

const activities: Activity[] = [
    { id: '1', status: 'published', tags: ['hiking', 'weekend'] },
    { id: '2', status: 'draft', tags: ['climbing'] },
];

test('createFilter should match items by exact primitive value', () => {
    const filter = createFilter<Activity>({ status: 'published' });

    const result = activities.filter(filter);

    expect(result).toEqual([activities[0]]);
});

test('createFilter should match items when array field includes the filter value', () => {
    const filter = createFilter<Activity>({ tags: 'climbing' as unknown as Activity['tags'] });

    const result = activities.filter(filter);

    expect(result).toEqual([activities[1]]);
});

test('createFilter should ignore filter fields that do not exist on the item', () => {
    const filter = createFilter<Activity>({
        status: 'published',
        unknown: 'value',
    } as Partial<Record<keyof Activity, Activity[keyof Activity]>>);

    const result = activities.filter(filter);

    expect(result).toEqual([activities[0]]);
});
