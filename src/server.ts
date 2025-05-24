import fastify from "fastify";
import { messageRoutes } from "./routes/messages.routes";

const app = fastify();

app.register(messageRoutes, { prefix: '/messages' });

app.listen({
    port: 3000,
}).then(() => {
    console.log("Server running on port 3000");
});