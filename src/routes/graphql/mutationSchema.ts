import { FastifyInstance } from 'fastify';
import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from 'graphql/type';
import { graphQLOutputUser } from './types/graphQLOutputUser';
import { graphQLInputCreateUser } from './types/graphQLInputCreateUser';
import { ChangeUserDTO, CreateUserDTO } from '../../utils/DB/entities/DBUsers';
import { graphQLOutputProfile } from './types/graphQLOutputProfile';
import { graphQLInputCreateProfile } from './types/graphQLInputCreateProfile';
import { CreateProfileDTO } from '../../utils/DB/entities/DBProfiles';
import { assertCreateProfile } from '../../utils/asserts/profileAsserts';
import { graphQLInputCreatePost } from './types/graphQLInputCreatePost';
import { CreatePostDTO } from '../../utils/DB/entities/DBPosts';
import { assertCreatePost } from '../../utils/asserts/postAsserts';
import { graphQLOutputPost } from './types/graphQLOutputPost';
import { constants as httpStatus } from 'http2';
import { ID_IS_REQUIRED, REQUEST_BODY_IS_REQUIRED } from '../../utils/messages/messages';
import { USER_NOT_FOUND } from '../../utils/messages/userMessages';

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
      updateUser: {
        type: graphQLOutputUser,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          variables: {
            type: new GraphQLNonNull(graphQLInputCreateUser),
          },
        },
        resolve: async (source: unknown, args) => {
          const { id, variables } = args;
          const userDto: ChangeUserDTO = variables;

          fastify.assert(id, httpStatus.HTTP_STATUS_BAD_REQUEST, ID_IS_REQUIRED);
          fastify.assert(userDto, httpStatus.HTTP_STATUS_BAD_REQUEST, REQUEST_BODY_IS_REQUIRED);

          const user = await fastify.db.users.findOne({
            key: 'id',
            equals: id,
          });

          fastify.assert(user, httpStatus.HTTP_STATUS_BAD_REQUEST, USER_NOT_FOUND);

          const updatedUser = await fastify.db.users.change(id, {
            ...userDto,
          });

          return updatedUser;
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
