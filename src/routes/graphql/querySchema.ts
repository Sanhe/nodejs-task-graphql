import { FastifyInstance } from 'fastify';
import { GraphQLID, GraphQLList, GraphQLObjectType } from 'graphql/type';
import { graphQLUser } from './types/users';
import { graphQLProfile } from './types/profiles';
import { graphQLPost } from './types/posts';
import { graphQLMemberType } from './types/memberTypes';

const getQuery = async (fastify: FastifyInstance): Promise<GraphQLObjectType> => {
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
      user: {
        type: graphQLUser,
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
        type: graphQLProfile,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (source, args) =>
          fastify.db.profiles.findOne({
            key: 'id',
            equals: args.id,
          }),
      },
      post: {
        type: graphQLPost,
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
        type: graphQLMemberType,
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
