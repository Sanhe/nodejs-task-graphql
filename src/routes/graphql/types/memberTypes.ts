import { GraphQLID, GraphQLObjectType, GraphQLString } from 'graphql/type';

const graphQLMemberType = new GraphQLObjectType({
  name: 'GraphQLMemberType',
  fields: () => ({
    id: { type: GraphQLID },
    discount: { type: GraphQLString },
    monthPostsLimit: { type: GraphQLString },
  }),
});

export { graphQLMemberType };
