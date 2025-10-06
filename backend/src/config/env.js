import dotenv from "dotenv"

dotenv.config();

export const ENV={
    PORT:process.env.PORT,
    NODE_ENV:process.env.NODE_ENV,
    MONGO_URI:process.env.MONGO_URI,
    CLERK_PUBLISHABLE_KEY:process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY:process.env.CLERK_SECRET_KEY,
    CLOUDNARY_CLOUD_NAME:process.env.CLOUDNARY_CLOUD_NAME,
    CLOUDNARY_ALI_KEY:process.env.CLOUDNARY_ALI_KEY,
    CLOUDNARY_API_SECRET:process.env.CLOUDNARY_API_SECRET,
    ARCJET_KEY:process.env.ARCJET_KEY
}