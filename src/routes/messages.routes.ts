import { FastifyInstance } from "fastify";
import { z } from "zod";
import { messageQueue } from "../libs/queue";
import { knex } from "../db/database";

const brazilianPhoneRegex = /^(\d{2})9\d{8}$/;

export async function messageRoutes(app: FastifyInstance) {
    app.post('/send', async (request, reply) => {
        const messageSchema = z.array(z.object({
            phone: z.string().regex(brazilianPhoneRegex, "O número de telefone deve ter um DDD válido e seguir o formato: XX9XXXXXXXX"),
            templateId: z.coerce.number().int("O ID do template deve ser um número inteiro positivo."),
            additionalData: z.record(z.string(), z.string())
        }));

        const parseResult = messageSchema.safeParse(request.body);

        if (!parseResult.success) {
            return reply.status(400).send({ errors: parseResult.error.format() });
        }

        const messages = parseResult.data;

        const templateIds = [...new Set(messages.map(m => m.templateId))];
        const templates = await knex('templates').select('id', 'content').whereIn('id', templateIds);

        const templateMap = Object.fromEntries(templates.map(t => [t.id, t.content]));

        const preparedMessages = messages
            .map(({ phone, templateId, additionalData }) => {
                const rawTemplate = templateMap[templateId];
                if (!rawTemplate) return null;

                const content = Object.entries(additionalData).reduce(
                    (text, [key, value]) => text.replaceAll(`<%${key}%>`, value),
                    rawTemplate
                );

                return { data: { phone, content } }


            })
            .filter(Boolean) as { data: { phone: string; content: string } }[];

        await messageQueue.addBulk(preparedMessages);

        return reply.status(201).send();
    });
}
