import { GraphQLInputObjectType, GraphQLString } from 'graphql/type';
import { GraphQLInputType } from 'graphql/type/definition';

const graphQLInputUpdateUser: GraphQLInputType = new GraphQLInputObjectType({
  name: 'GraphQLInputUpdateUser',
  fields: () => ({
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

export { graphQLInputUpdateUser };
