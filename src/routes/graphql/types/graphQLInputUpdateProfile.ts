import { GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLString } from 'graphql/type';
import { GraphQLInputType } from 'graphql/type/definition';

const graphQLInputUpdateProfile: GraphQLInputType = new GraphQLInputObjectType({
  name: 'GraphQLInputUpdateProfile',
  fields: () => ({
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLID },
    userId: { type: GraphQLID },
  }),
});

export { graphQLInputUpdateProfile };
