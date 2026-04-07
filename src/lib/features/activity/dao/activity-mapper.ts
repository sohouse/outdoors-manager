import { ActivityItem, ActivityRecord } from "../shared/activity";

const toActivityDomain = (record: ActivityRecord): ActivityItem => {
    return {
        id: record.id,
        leader_name: record.leader_id ?? undefined,
        desc: record.desc ?? undefined,
        title: record.title,
        type: record.type,
        status: record.status,
        start_time: record.start_time,
        end_time: record.end_time,
        content: record.content ?? undefined,
        car_No: record.car_id ?? undefined,
        create_time: record.create_time,
        author: record.author,
        creator_id: record.creator_id ?? undefined,
    }
}

export const toActivityDomainList = (records: ActivityRecord[]): ActivityItem[] => {
    return records.map(toActivityDomain);
}