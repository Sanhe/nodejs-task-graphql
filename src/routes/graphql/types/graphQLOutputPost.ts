import { GraphQLID, GraphQLObjectType, GraphQLOutputType, GraphQLString } from 'graphql/type';

const graphQLOutputPost: GraphQLOutputType = new GraphQLObjectType({
  name: 'GraphQLPost',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLID },
  }),
});

export { graphQLOutputPost };
