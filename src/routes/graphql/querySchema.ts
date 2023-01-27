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
  const graphQLProfile = new GraphQLObjectType({
    name: 'GraphQLProfile',
    fields: () => ({
      id: { type: GraphQLID },
      avatar: { type: GraphQLString },
      sex: { type: GraphQLString },
      birthday: { type: GraphQLString },
      country: { type: GraphQLString },
      street: { type: GraphQLString },
      city: { type: GraphQLString },
      memberTypeId: { type: GraphQLString },
      userId: { type: GraphQLID },
    }),
  });
  const graphQLPost = new GraphQLObjectType({
    name: 'GraphQLPost',
    fields: () => ({
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      content: { type: GraphQLString },
      userId: { type: GraphQLID },
    }),
  });
  const graphQLMemberType = new GraphQLObjectType({
    name: 'GraphQLMemberType',
    fields: () => ({
      id: { type: GraphQLID },
      discount: { type: GraphQLString },
      monthPostsLimit: { type: GraphQLString },
    }),
  });

  const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(graphQLUser),
        resolve: async () => fastify.db.users.findMany(),
      },
      profiles: {
        type: new GraphQLList(graphQLProfile),
        resolve: async () => fastify.db.profiles.findMany(),
      },
      posts: {
        type: new GraphQLList(graphQLPost),
        resolve: async () => fastify.db.posts.findMany(),
      },
      memberTypes: {
        type: new GraphQLList(graphQLMemberType),
        resolve: async () => fastify.db.memberTypes.findMany(),
      },
    },
  });

  return query;
};

export { getQuery };
