import dotenv from "dotenv";
dotenv.config();

const requiredEnv = [
  "PORT",
  "NODE_ENV",
  "MONGODB_URI",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
];

for (const envName of requiredEnv) {
  if (!process.env[envName]?.trim()) {
    throw new Error(`Missing required environment variable: ${envName}`);
  }
}

const config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  mongodbUri: process.env.MONGODB_URI,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

export default config;
