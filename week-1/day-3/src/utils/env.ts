import dotenv from 'dotenv'

dotenv.config()

export default {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
} as const