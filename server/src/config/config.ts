import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI
};

export default config;
