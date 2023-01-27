import { FastifyInstance } from 'fastify';
import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/type';

const getQuery = async (fastify: FastifyInstance): Promise<GraphQLObjectType> => {
  const graphQLUser = new GraphQLObjectType({
    name: 'GraphQLUser',
    fields: () => ({
      id: { type: GraphQLID },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      email: { type: GraphQLString },
      subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    }),
  });

  const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(graphQLUser),
        resolve: async () => fastify.db.users.findMany(),
      },
    },
  });

  return query;
};

export { getQuery };
