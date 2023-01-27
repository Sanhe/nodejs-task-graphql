import { graphql } from 'graphql/graphql';
import { GraphQLSchema } from 'graphql/type';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { getQuery } from './querySchema';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request) {
      const { query } = request.body;

      const schema = new GraphQLSchema({
        query: await getQuery(fastify),
      });

      const response = await graphql({
        schema,
        source: String(query),
      });

      return response;
    }
  );
};

export default plugin;
