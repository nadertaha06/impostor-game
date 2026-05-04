import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),
  showGameDebug: process.env.SHOW_GAME_DEBUG === "true",
  smsProvider: process.env.SMS_PROVIDER ?? "fake"
};
