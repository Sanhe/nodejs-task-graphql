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
import { getDataLoader } from './dataLoaders/dataLoaders';

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
      const queryString = String(query);
      const schema = new GraphQLSchema({
        query: await getQuery(),
        mutation: await getMutation(),
      });

      const parsedQuery = parse(queryString);
      const depthLimitRule = depthLimit(DEPTH_LIMIT);

      const errors = validate(schema, parsedQuery, [depthLimitRule]);

      if (errors.length > 0) {
        const errorResponse = {
          errors,
          data: null,
        };

        return errorResponse;
      }

      const dataLoader = getDataLoader(fastify);

      const response = await graphql({
        schema,
        source: queryString,
        contextValue: { fastify, dataLoader },
        variableValues: variables,
      });

      return response;
    }
  );
};

export default plugin;
