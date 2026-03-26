import test from 'node:test';
import assert from 'node:assert/strict';

import { editActivityCheck } from './activity-check.ts';
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

    assert.equal(result.success, true);
    if (result.success) {
        assert.equal(result.data.id, 'activity-1');
        assert.equal(result.data.type, ActivityTypes.徒步);
        assert.equal(result.data.status, ActivityStatus.报名中);
    }
});

test('editActivityCheck should fill default enum values when omitted', () => {
    const result = editActivityCheck.safeParse({
        id: 'activity-2',
        title: '默认值校验',
    });

    assert.equal(result.success, true);
    if (result.success) {
        assert.equal(result.data.type, ActivityTypes.未指定);
        assert.equal(result.data.status, ActivityStatus.未开始);
    }
});

test('editActivityCheck should reject invalid date string', () => {
    const result = editActivityCheck.safeParse({
        id: 'activity-3',
        start_time: 'not-a-date',
    });

    assert.equal(result.success, false);
    if (!result.success) {
        assert.equal(result.error.issues[0]?.message, 'Invalid date format');
        assert.equal(result.error.issues[0]?.path[0], 'start_time');
    }
});
