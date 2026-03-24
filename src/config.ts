import dotenv from "dotenv";
dotenv.config();

function envOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

export const config = {
  port: parseInt(process.env.PORT || "3000"),
  nodeEnv: process.env.NODE_ENV || "development",
  db: {
    url: envOrThrow("DATABASE_URL"),
  },
  redis: {
    host: process.env.REDIS_HOST || "redis",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
  jwt: {
    secret: envOrThrow("JWT_SECRET"),
    expiresIn: "7d",
  },
}