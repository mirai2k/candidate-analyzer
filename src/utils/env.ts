import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3301"),
  GEMINI_API_URL: z.string(),
  GEMINI_API_TOKEN: z.string(),
});

export const env = envSchema.parse(process.env);
