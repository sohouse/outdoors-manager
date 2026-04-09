import { expect, test } from 'vitest';

import { activityConditionCheck, editActivityCheck } from '../shared/activity-check.ts';
import { ActivityStatus, ActivityTypes } from '../shared/activity.ts';

test('editActivityCheck should parse valid activity payload', () => {
    const result = editActivityCheck.safeParse({
        id: 'activity-1',
        title: '周末徒步',
        author: 'will',
        start_time: '2026-03-25T09:00:00.000Z',
        end_time: '2026-03-25T18:00:00.000Z',
        type: ActivityTypes.徒步,
        status: ActivityStatus.报名中,
    });

    expect(result.success).toBe(true);
    if (result.success) {
        expect(result.data.id).toBe('activity-1');
        expect(result.data.type).toBe(ActivityTypes.徒步);
        expect(result.data.status).toBe(ActivityStatus.报名中);
    }
});

test('editActivityCheck should fill default enum values when omitted', () => {
    const result = editActivityCheck.safeParse({
        id: 'activity-2',
        title: '默认值校验',
    });

    expect(result.success).toBe(true);
    if (result.success) {
        expect(result.data.type).toBe(ActivityTypes.未指定);
        expect(result.data.status).toBe(ActivityStatus.未开始);
    }
});

test('editActivityCheck should reject invalid date string', () => {
    const result = editActivityCheck.safeParse({
        id: 'activity-3',
        start_time: 'not-a-date',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Invalid date format');
        expect(result.error.issues[0]?.path[0]).toBe('start_time');
    }
});

test('activityConditionCheck should accept datetime-local input', () => {
    const result = activityConditionCheck.safeParse({
        start_time: '2026-04-09T14:30',
        end_time: '2026-04-09T16:45',
    });

    expect(result.success).toBe(true);
    if (result.success) {
        expect(result.data.start_time).toBe('2026-04-09T14:30');
        expect(result.data.end_time).toBe('2026-04-09T16:45');
    }
});

test('activityConditionCheck should treat empty search fields as undefined', () => {
    const result = activityConditionCheck.safeParse({
        author: '',
        title: '',
        start_time: '',
        end_time: '',
        type: '',
        status: '',
    });

    expect(result.success).toBe(true);
    if (result.success) {
        expect(result.data.author).toBeUndefined();
        expect(result.data.title).toBeUndefined();
        expect(result.data.start_time).toBeUndefined();
        expect(result.data.end_time).toBeUndefined();
        expect(result.data.type).toBeUndefined();
        expect(result.data.status).toBeUndefined();
    }
});
