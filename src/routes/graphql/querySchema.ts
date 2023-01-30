import { GraphQLID, GraphQLList, GraphQLObjectType } from 'graphql/type';
import { graphQLOutputUser } from './types/graphQLOutputUser';
import { graphQLOutputProfile } from './types/graphQLOutputProfile';
import { graphQLOutputPost } from './types/graphQLOutputPost';
import { graphQLOutputMemberType } from './types/graphQLOutputMemberType';

const getQuery = async (): Promise<GraphQLObjectType> => {
  const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(graphQLOutputUser),
        resolve: async (source, args, { fastify, dataLoader }) => {
          const results = await fastify.db.users.findMany();

          dataLoader.primeManyUsers(results);

          return results;
        },
      },
      profiles: {
        type: new GraphQLList(graphQLOutputProfile),
        resolve: async (source, args, { fastify, dataLoader }) => {
          const results = await fastify.db.profiles.findMany();

          dataLoader.primeManyProfiles(results);

          return results;
        },
      },
      posts: {
        type: new GraphQLList(graphQLOutputPost),
        resolve: async (source, args, { fastify, dataLoader }) => {
          const results = await fastify.db.posts.findMany();

          dataLoader.primeManyPosts(results);

          return results;
        },
      },
      memberTypes: {
        type: new GraphQLList(graphQLOutputMemberType),
        resolve: async (source, args, { fastify, dataLoader }) => {
          const results = await fastify.db.memberTypes.findMany();

          dataLoader.primeMemberTypes(results);

          return results;
        },
      },
      user: {
        type: graphQLOutputUser,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (source, args, { dataLoader }) => {
          const { id } = args;
          const result = await dataLoader.users.load(id);

          return result;
        },
      },
      profile: {
        type: graphQLOutputProfile,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (source, args, { dataLoader }) => {
          const { id } = args;

          const result = await dataLoader.profiles.load(id);

          return result;
        },
      },
      post: {
        type: graphQLOutputPost,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (source, args, { dataLoader }) => {
          const { id } = args;

          const result = await dataLoader.posts.load(id);

          return result;
        },
      },
      memberType: {
        type: graphQLOutputMemberType,
        args: {
          id: { type: GraphQLID },
        },
        resolve: async (source, args, { dataLoader }) => {
          const { id } = args;

          const result = await dataLoader.memberTypes.load(id);

          return result;
        },
      },
    },
  });

  return query;
};

export { getQuery };
