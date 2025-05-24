import Queue from "bull";
import SendWhatsMessageJob from "../jobs/send-message.job";
import { env } from "../env";

const messageQueue = new Queue(SendWhatsMessageJob.key, {
    redis: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT
    }
})

export { messageQueue }