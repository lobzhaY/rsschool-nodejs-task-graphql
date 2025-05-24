import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, mainSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const documentAST = parse(req.body.query);
      const errors = validate(mainSchema, documentAST, [depthLimit(5)]);
      if (errors.length) return { errors };
      
      return graphql({
        schema: mainSchema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: {
          prisma,
        },
      });
    },
  });
};

export default plugin;
