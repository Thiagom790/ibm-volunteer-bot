import { Knex, knex as setupKnex } from "knex";
import { env } from "../env";

export const config: Knex.Config = {
}

export const knex = setupKnex(config);