import { GraphQLID, GraphQLObjectType, GraphQLOutputType, GraphQLString } from 'graphql/type';

const graphQLOutputMemberType: GraphQLOutputType = new GraphQLObjectType({
  name: 'GraphQLMemberType',
  fields: () => ({
    id: { type: GraphQLID },
    discount: { type: GraphQLString },
    monthPostsLimit: { type: GraphQLString },
  }),
});

export { graphQLOutputMemberType };
