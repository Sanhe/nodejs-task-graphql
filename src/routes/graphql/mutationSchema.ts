import { FastifyInstance } from 'fastify';
import { GraphQLNonNull, GraphQLObjectType } from 'graphql/type';
import { graphQLOutputUser } from './types/graphQLOutputUser';
import { graphQLInputCreateUser } from './types/graphQLInputCreateUser';
import { CreateUserDTO } from '../../utils/DB/entities/DBUsers';

const getMutation = async (fastify: FastifyInstance): Promise<GraphQLObjectType> =>
  new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: graphQLOutputUser,
        args: {
          variables: {
            type: new GraphQLNonNull(graphQLInputCreateUser),
          },
        },
        resolve: async (source: unknown, args) => {
          const { variables } = args;
          const { firstName, lastName, email }: CreateUserDTO = variables;

          const user = await fastify.db.users.create({
            firstName,
            lastName,
            email,
          });

          return user;
        },
      },
    },
  });

export { getMutation };
