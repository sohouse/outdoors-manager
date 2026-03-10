import { AppType } from "@/app/(app)/server/main";
import { AppConfig } from "@/types/server";
import { hc } from "hono/client";

export const appConfig: AppConfig = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
};

const honoApi = hc<AppType>(appConfig.baseUrl);

const fetchApi = async<F extends (c: ReturnType<typeof hc<AppType>>) => Promise<any>>
    (run: F): Promise<ReturnType<F>> => {
    const result = await run(honoApi);
    if (result && typeof result === 'object' && 'json' in result) {
        return (result as { json: () => Promise<ReturnType<F>> }).json();
    }
    return result;
}

export { fetchApi, honoApi };