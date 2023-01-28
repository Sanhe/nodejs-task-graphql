import { FastifyInstance } from 'fastify';
import { graphql } from 'graphql/graphql';
import { GraphQLSchema } from 'graphql/type';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { getQuery } from './querySchema';
import { GraphQLRequestType } from './graphQLRequestType';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async (request: GraphQLRequestType) => {
      const { query } = request.body;

      const schema = new GraphQLSchema({
        query: await getQuery(fastify),
      });

      const response = await graphql({
        schema,
        source: String(query),
        contextValue: { fastify },
      });

      return response;
    }
  );
};

export default plugin;
