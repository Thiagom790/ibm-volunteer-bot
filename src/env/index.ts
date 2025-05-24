import { z } from "zod";

const envSchema = z.object({
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_HOST: z.string().default("127.0.0.1"),
    DATABASE_HOST: z.string().default("127.0.0.1"),
    DATABASE_PORT: z.coerce.number().default(5432),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_NAME: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    console.error("Invalid environment variables", _env.error.format())
    throw new Error("Invalid environment variables")
}

export const env = _env.data