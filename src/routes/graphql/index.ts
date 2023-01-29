import { FastifyInstance } from 'fastify';
import { graphql } from 'graphql/graphql';
import { GraphQLSchema } from 'graphql/type';
import { parse } from 'graphql/language';
import { validate } from 'graphql/validation';
import * as depthLimit from 'graphql-depth-limit';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { getQuery } from './querySchema';
import { GraphQLRequestType } from './graphQLRequestType';
import { getMutation } from './mutationSchema';
import { DEPTH_LIMIT } from './configs';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async (request: GraphQLRequestType) => {
      const { query, variables } = request.body;

      const schema = new GraphQLSchema({
        query: await getQuery(fastify),
        mutation: await getMutation(fastify),
      });

      const parsedQuery = parse(String(query));
      const depthLimitRule = depthLimit(DEPTH_LIMIT);

      const errors = validate(schema, parsedQuery, [depthLimitRule]);

      if (errors.length > 0) {
        const errorResponse = {
          errors,
          data: null,
        };

        return errorResponse;
      }

      const response = await graphql({
        schema,
        source: String(query),
        contextValue: { fastify },
        variableValues: variables,
      });

      return response;
    }
  );
};

export default plugin;
