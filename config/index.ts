import dotenv from "dotenv";
dotenv.config();

export const MONGO_URI: string | undefined = process.env.CONNECTION_STRING;