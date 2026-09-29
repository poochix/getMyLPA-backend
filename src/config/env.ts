import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
    .optional(),

  //forces zod to convert other type into number
  PORT: z.coerce.number().int().positive().default(8000),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required').optional(),

  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters')
    .optional(),

  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters')
    .optional(),

  CORS_ORIGIN: z.url().optional(),

  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required').optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:');

  console.error(parsedEnv.error.flatten().fieldErrors);

  process.exit(1);
}

export const env = parsedEnv.data;
