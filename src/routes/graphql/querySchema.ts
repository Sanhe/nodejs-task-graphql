import { FastifyInstance } from 'fastify';
import { GraphQLID, GraphQLList, GraphQLObjectType } from 'graphql/type';
import { graphQLOutputUser } from './types/graphQLOutputUser';
import { graphQLOutputProfile } from './types/graphQLOutputProfile';
import { graphQLOutputPost } from './types/graphQLOutputPost';
import { graphQLOutputMemberType } from './types/graphQLOutputMemberType';

const getQuery = async (fastify: FastifyInstance): Promise<GraphQLObjectType> => {
  const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(graphQLOutputUser),
        resolve: async () => fastify.db.users.findMany(),
      },
      profiles: {
        type: new GraphQLList(graphQLOutputProfile),
        resolve: async () => fastify.db.profiles.findMany(),
      },
      posts: {
        type: new GraphQLList(graphQLOutputPost),
        resolve: async () => fastify.db.posts.findMany(),
      },
      memberTypes: {
        type: new GraphQLList(graphQLOutputMemberType),
        resolve: async () => fastify.db.memberTypes.findMany(),
      },
      user: {
        type: graphQLOutputUser,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (source, args) =>
          fastify.db.users.findOne({
            key: 'id',
            equals: args.id,
          }),
      },
      profile: {
        type: graphQLOutputProfile,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (source, args) => {
          const { id } = args;

          const result = fastify.db.profiles.findOne({
            key: 'id',
            equals: id,
          });

          return result;
        },
      },
      post: {
        type: graphQLOutputPost,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (source, args) =>
          fastify.db.posts.findOne({
            key: 'id',
            equals: args.id,
          }),
      },
      memberType: {
        type: graphQLOutputMemberType,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (source, args) =>
          fastify.db.memberTypes.findOne({
            key: 'id',
            equals: args.id,
          }),
      },
    },
  });

  return query;
};

export { getQuery };
