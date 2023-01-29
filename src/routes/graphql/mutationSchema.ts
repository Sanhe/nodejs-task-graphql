import { FastifyInstance } from 'fastify';
import { GraphQLNonNull, GraphQLObjectType } from 'graphql/type';
import { graphQLOutputUser } from './types/graphQLOutputUser';
import { graphQLInputCreateUser } from './types/graphQLInputCreateUser';
import { CreateUserDTO } from '../../utils/DB/entities/DBUsers';
import { graphQLOutputProfile } from './types/graphQLOutputProfile';
import { graphQLInputCreateProfile } from './types/graphQLInputCreateProfile';
import { CreateProfileDTO } from '../../utils/DB/entities/DBProfiles';
import { assertCreateProfile } from '../../utils/asserts/profileAsserts';
import { graphQLInputCreatePost } from './types/graphQLInputCreatePost';
import { CreatePostDTO } from '../../utils/DB/entities/DBPosts';
import { assertCreatePost } from '../../utils/asserts/postAsserts';
import { graphQLOutputPost } from './types/graphQLOutputPost';

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
          const userDto: CreateUserDTO = variables;

          const user = await fastify.db.users.create(userDto);

          return user;
        },
      },
      createProfile: {
        type: graphQLOutputProfile,
        args: {
          variables: {
            type: new GraphQLNonNull(graphQLInputCreateProfile),
          },
        },
        resolve: async (source: unknown, args) => {
          const { variables } = args;
          const profileDto: CreateProfileDTO = variables;

          await assertCreateProfile(profileDto, fastify);

          const profile = await fastify.db.profiles.create(profileDto);

          return profile;
        },
      },
      createPost: {
        type: graphQLOutputPost,
        args: {
          variables: {
            type: new GraphQLNonNull(graphQLInputCreatePost),
          },
        },
        resolve: async (source: unknown, args) => {
          const { variables } = args;
          const postDto: CreatePostDTO = variables;

          await assertCreatePost(postDto, fastify);

          const post = await fastify.db.posts.create(postDto);

          return post;
        },
      },
    },
  });

export { getMutation };
