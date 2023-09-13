import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const SENDGRID_API_EMAIL = process.env.SENDGRID_API_EMAIL;
