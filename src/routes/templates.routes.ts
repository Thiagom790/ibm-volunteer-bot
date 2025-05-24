import { FastifyInstance } from "fastify";
import { knex } from "../db/database";
import { z } from "zod";

export async function templatesRoutes(app: FastifyInstance) {
    app.get('/', async (_request, reply) => {
        const templates = await knex('templates')
            .select('id', 'content', 'name', "createdAt", "updatedAt")
            .orderBy('createdAt', 'desc');

        return reply.status(200).send(templates);
    });

    app.post('/', async (request, reply) => {
        const templateSchema = z.object({
            content: z.string().max(250, "O template deve ter no máximo 250 caracteres."),
            name: z.string().max(50, "O nome do template deve ter no máximo 50 caracteres.")
        })

        const parseResult = templateSchema.safeParse(request.body);

        if (!parseResult.success) {
            return reply.status(400).send({ errors: parseResult.error.format() });
        }

        const { content, name } = parseResult.data;

        await knex('templates').insert({ content, name });

        return reply.status(201).send();
    });

    app.put('/:id', async (request, reply) => {
        const templateSchema = z.object({
            content: z.string().max(250, "O template deve ter no máximo 250 caracteres."),
            name: z.string().max(50, "O nome do template deve ter no.maxcdn 50 caracteres.")
        })

        const parseResult = templateSchema.safeParse(request.body);

        if (!parseResult.success) {
            return reply.status(400).send({ errors: parseResult.error.format() });
        }

        const { content, name } = parseResult.data;

        const { id } = request.params as { id: string };

        await knex('templates').where('id', id).update({ content, name });

        return reply.status(200).send();
    });
}