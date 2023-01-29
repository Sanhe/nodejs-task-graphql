import { GraphQLID, GraphQLInputObjectType, GraphQLString } from 'graphql/type';
import { GraphQLInputType } from 'graphql/type/definition';

const graphQLInputUpdatePost: GraphQLInputType = new GraphQLInputObjectType({
  name: 'GraphQLInputUpdatePost',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLID },
  }),
});

export { graphQLInputUpdatePost };
