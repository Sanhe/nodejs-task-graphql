import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLOutputType, GraphQLString } from 'graphql/type';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { graphQLPost } from './posts';
import { graphQLProfile } from './profiles';
import { graphQLMemberType } from './memberTypes';

const graphQLUser: GraphQLOutputType = new GraphQLObjectType({
  name: 'GraphQLUser',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    userSubscribedTo: {
      type: new GraphQLList(graphQLUser),
      resolve: async (source: UserEntity, args: unknown, { fastify }) => {
        const userId = source.id;
        const userSubscribedTo: UserEntity[] = await fastify.db.users.findMany({
          key: 'subscribedToUserIds',
          inArray: userId,
        });

        return userSubscribedTo;
      },
    },
    subscribedToUser: {
      type: new GraphQLList(graphQLUser),
      resolve: async (source: UserEntity, args: unknown, { fastify }) => {
        const { subscribedToUserIds } = source;
        const subscribedToUser = subscribedToUserIds.map(async (subscriberId: string) => {
          const subscribed = await fastify.db.users.findOne({
            key: 'id',
            equals: subscriberId,
          });

          return subscribed;
        });

        return subscribedToUser;
      },
    },
    profile: {
      type: graphQLProfile,
      resolve: async (source: UserEntity, args: unknown, { fastify }) => {
        const userId = source.id;
        const profile = await fastify.db.profiles.findOne({
          key: 'userId',
          equals: userId,
        });

        return profile;
      },
    },
    posts: {
      type: new GraphQLList(graphQLPost),
      resolve: async (source: UserEntity, args: unknown, { fastify }) => {
        const userId = source.id;
        const posts = await fastify.db.posts.findMany({
          key: 'userId',
          equals: userId,
        });

        return posts;
      },
    },
    memberType: {
      type: graphQLMemberType,
      resolve: async (source: UserEntity, args: unknown, { fastify }) => {
        const profile = await fastify.db.profiles.findOne({
          key: 'userId',
          equals: source.id,
        });

        if (!profile) {
          return null;
        }

        const { memberTypeId } = profile;

        const memberType = await fastify.db.memberTypes.findOne({
          key: 'id',
          equals: memberTypeId,
        });

        return memberType;
      },
    },
  }),
});

export { graphQLUser };
