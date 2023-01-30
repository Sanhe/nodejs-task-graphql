import { GraphQLInputObjectType, GraphQLInt } from 'graphql/type';
import { GraphQLInputType } from 'graphql/type/definition';

const graphQLInputUpdateMemberType: GraphQLInputType = new GraphQLInputObjectType({
  name: 'GraphQLInputUpdateMemberType',
  fields: () => ({
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }),
});

export { graphQLInputUpdateMemberType };
