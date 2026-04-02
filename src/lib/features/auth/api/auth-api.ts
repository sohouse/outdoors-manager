import {Hono} from "hono";
import {logInMethod, logOut, signUp} from "@/lib/features/auth/service/auth-service.ts";
import {logInCheck, signUpCheck} from "@/lib/features/auth/check/auth-check.ts";
import {ApplicationException} from "@/lib/types/application-exception.ts";
import {LOGIN_ERROR, LOGOUT_ERROR} from "@/lib/types/error-type.ts";

const app = new Hono();
export const authApi = app
    .post('/logIn', async (context) => {
        try {
            const query = logInCheck.parse(context.req.query());
            const result = await logInMethod(query);
            return context.json(result, 200);
        } catch {
            throw new ApplicationException(LOGIN_ERROR)
        }
    })
    .get('/logOut', async (context) => {
        try {
            await logOut();
            return context.json(true, 200);
        } catch {
            throw new ApplicationException(LOGOUT_ERROR)
        }
    })
    .post('/signUp', async (context) => {
        try {
            const query = await signUpCheck.parse(context.req.json());
            const success = await signUp(query);
            if (success) return context.json(success, 200);
            else return context.json({result: false}, 500);
        } catch (e) {
            throw e
        }
    })
;
