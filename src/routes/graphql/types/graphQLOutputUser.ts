import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLOutputType, GraphQLString } from 'graphql/type';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { graphQLOutputPost } from './graphQLOutputPost';
import { graphQLOutputProfile } from './graphQLOutputProfile';
import { graphQLOutputMemberType } from './graphQLOutputMemberType';

const graphQLOutputUser: GraphQLOutputType = new GraphQLObjectType({
  name: 'GraphQLUser',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    userSubscribedTo: {
      type: new GraphQLList(graphQLOutputUser),
      resolve: async (source: UserEntity, args: unknown, { dataLoader }) => {
        const userId = source.id;

        const userSubscribedTo = await dataLoader.usersBySubscribedToUserIds.load(userId);

        return userSubscribedTo;
      },
    },
    subscribedToUser: {
      type: new GraphQLList(graphQLOutputUser),
      resolve: async (source: UserEntity, args: unknown, { dataLoader }) => {
        const { subscribedToUserIds } = source;
        const subscribedToUser = await dataLoader.users.loadMany(subscribedToUserIds);

        return subscribedToUser;
      },
    },
    profile: {
      type: graphQLOutputProfile,
      resolve: async (source: UserEntity, args: unknown, { dataLoader }) => {
        const userId = source.id;
        const profile = await dataLoader.profileByUserId.load(userId);

        return profile;
      },
    },
    posts: {
      type: new GraphQLList(graphQLOutputPost),
      resolve: async (source: UserEntity, args: unknown, { dataLoader }) => {
        const userId = source.id;
        const posts = await dataLoader.postsByUserId.load(userId);

        return posts;
      },
    },
    memberType: {
      type: graphQLOutputMemberType,
      resolve: async (source: UserEntity, args: unknown, { dataLoader }) => {
        const userId = source.id;
        const profile = await dataLoader.profileByUserId.load(userId);

        if (!profile) {
          return null;
        }

        const { memberTypeId } = profile;

        const memberType = await dataLoader.memberTypes.load(memberTypeId);

        return memberType;
      },
    },
  }),
});

export { graphQLOutputUser };
