import { client } from '../client.ts'
import {initActivity} from '../activityDao.ts'

const seed = async () => {
    try {
        await initActivity();
    } catch (e) {
        console.error('Seed failed:', e);
        process.exit(1);
    } finally {
        await client.$disconnect();
    }
    process.exit(0);
};

// 确保在模块加载完成后执行
if (import.meta.url === `file://${process.argv[1]}`) {
    seed();
}
