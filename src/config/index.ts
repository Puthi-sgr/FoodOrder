import dotenv from "dotenv";
dotenv.config();

export const MONGO_URI: string = process.env.CONNECTION_STRING;
export const PORT: string | undefined = process.env.PORT;
