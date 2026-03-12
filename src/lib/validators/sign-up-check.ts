import z from "zod";

export const signUpCheck = z.object({
    name: z
        .string()
        .min(5, 'name must be at least 5 characters.'),

    email: z
        .email(),

    pwd: z
        .string()
        .min(8, 'password must be at least 8 characters.')
        .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, 'must include letter and number.')
})