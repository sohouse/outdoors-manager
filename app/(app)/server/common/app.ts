import { Hono } from "hono";
import { Env } from "hono/types";

export const createHonoApp = <E extends Env>() => {
    const app = new Hono<E>();
    return app;
}