import { GraphQLID, GraphQLObjectType, GraphQLString } from 'graphql/type';

const graphQLPost = new GraphQLObjectType({
  name: 'GraphQLPost',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLID },
  }),
});

export { graphQLPost };
