import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql/type';
import { GraphQLInputType } from 'graphql/type/definition';

const graphQLInputCreateUser: GraphQLInputType = new GraphQLInputObjectType({
  name: 'GraphQLInputCreateUser',
  fields: () => ({
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export { graphQLInputCreateUser };
