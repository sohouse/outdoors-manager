import { prismaClient } from "../../../database/prisma-client.ts";
import { ApplicationException } from "../../../types/application-exception.ts";
import { INTERNAL_ERROR } from "../../../types/error-type copy.ts";

const PERMISSIONS = [
    { key: "activity:read", name: "查看活动" },
    { key: "activity:create", name: "创建活动" },
    { key: "activity:update.own", name: "编辑自己的活动" },
    { key: "activity:update.any", name: "编辑任意活动" },
    { key: "activity:delete.own", name: "删除自己的活动" },
    { key: "activity:delete.any", name: "删除任意活动" },
];

export const initPermission = async (): Promise<void> => {
    try {
        await prismaClient.permission.deleteMany();
        await prismaClient.permission.createMany({
            data: PERMISSIONS,
        });
    } catch {
        throw new ApplicationException(INTERNAL_ERROR);
    }
};
