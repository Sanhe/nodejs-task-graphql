import { GraphQLID, GraphQLObjectType, GraphQLString } from 'graphql/type';

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

export { graphQLProfile };
