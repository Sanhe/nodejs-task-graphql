import { GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql/type';
import { GraphQLInputType } from 'graphql/type/definition';

const graphQLInputCreateProfile: GraphQLInputType = new GraphQLInputObjectType({
  name: 'GraphQLInputCreateProfile',
  fields: () => ({
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

export { graphQLInputCreateProfile };