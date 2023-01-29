import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLOutputType, GraphQLString } from 'graphql/type';

const graphQLOutputProfile: GraphQLOutputType = new GraphQLObjectType({
  name: 'GraphQLProfile',
  fields: () => ({
    id: { type: GraphQLID },
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

export { graphQLOutputProfile };
