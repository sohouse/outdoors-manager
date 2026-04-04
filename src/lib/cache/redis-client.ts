import { Redis } from "@upstash/redis";

let redisClient: Redis | null | undefined;

export const getRedisClient = (): Redis | null => {
    if (redisClient !== undefined) {
        return redisClient;
    }

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        redisClient = null;
        return redisClient;
    }

    redisClient = Redis.fromEnv();
    return redisClient;
};

export const isRedisEnabled = (): boolean => getRedisClient() !== null;
