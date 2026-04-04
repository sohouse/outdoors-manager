import { prismaClient } from './prisma-client.ts'
import {initActivity} from '../features/activity/dao/activity-seed.ts'
import { initPermission } from '../features/role-permission/dao/role-permission-seed.ts';

const seed = async () => {
    try {
        await initActivity();
        await initPermission();
    } catch (e) {
        console.error('Seed failed:', e);
        process.exit(1);
    } finally {
        await prismaClient.$disconnect();
    }
    process.exit(0);
};

// 确保在模块加载完成后执行
if (import.meta.url === `file://${process.argv[1]}`) {
    seed();
}
