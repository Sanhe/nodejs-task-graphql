import { FastifyInstance } from 'fastify';
import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from 'graphql/type';
import { graphQLOutputUser } from './types/graphQLOutputUser';
import { graphQLInputCreateUser } from './types/graphQLInputCreateUser';
import { ChangeUserDTO, CreateUserDTO } from '../../utils/DB/entities/DBUsers';
import { graphQLOutputProfile } from './types/graphQLOutputProfile';
import { graphQLInputCreateProfile } from './types/graphQLInputCreateProfile';
import { ChangeProfileDTO, CreateProfileDTO } from '../../utils/DB/entities/DBProfiles';
import { assertCreateProfile } from '../../utils/asserts/profileAsserts';
import { graphQLInputCreatePost } from './types/graphQLInputCreatePost';
import { CreatePostDTO } from '../../utils/DB/entities/DBPosts';
import { assertCreatePost } from '../../utils/asserts/postAsserts';
import { graphQLOutputPost } from './types/graphQLOutputPost';
import { constants as httpStatus } from 'http2';
import { USER_NOT_FOUND } from '../../utils/messages/userMessages';
import { graphQLInputUpdateUser } from './types/graphQLInputUpdateUser';
import { graphQLInputUpdateProfile } from './types/graphQLInputUpdateProfile';

const getMutation = async (fastify: FastifyInstance): Promise<GraphQLObjectType> =>
  new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: graphQLOutputUser,
        args: {
          data: {
            type: new GraphQLNonNull(graphQLInputCreateUser),
          },
        },
        resolve: async (source: unknown, args) => {
          const { data }: { data: CreateUserDTO } = args;

          const user = await fastify.db.users.create(data);

          return user;
        },
      },
      updateUser: {
        type: graphQLOutputUser,
        args: {
          userId: { type: new GraphQLNonNull(GraphQLID) },
          data: {
            type: graphQLInputUpdateUser,
          },
        },
        resolve: async (source: unknown, args) => {
          const { userId, data } = args;
          const userDto: ChangeUserDTO = data;

          const user = await fastify.db.users.findOne({
            key: 'id',
            equals: userId,
          });

          fastify.assert(user, httpStatus.HTTP_STATUS_BAD_REQUEST, USER_NOT_FOUND);

          const updatedUser = await fastify.db.users.change(userId, userDto);

          return updatedUser;
        },
      },
      createProfile: {
        type: graphQLOutputProfile,
        args: {
          data: {
            type: new GraphQLNonNull(graphQLInputCreateProfile),
          },
        },
        resolve: async (source: unknown, args) => {
          const { data } = args;
          const profileDto: CreateProfileDTO = data;

          await assertCreateProfile(profileDto, fastify);

          const profile = await fastify.db.profiles.create(profileDto);

          return profile;
        },
      },
      updateProfile: {
        type: graphQLOutputProfile,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          data: {
            type: graphQLInputUpdateProfile,
          },
        },
        resolve: async (source: unknown, args) => {
          const { id, data } = args;
          const profileDto: ChangeProfileDTO = data;

          const profile = await fastify.db.profiles.findOne({
            key: 'id',
            equals: id,
          });

          fastify.assert(profile, httpStatus.HTTP_STATUS_BAD_REQUEST, USER_NOT_FOUND);

          const updatedProfile = await fastify.db.profiles.change(id, profileDto);

          return updatedProfile;
        },
      },
      createPost: {
        type: graphQLOutputPost,
        args: {
          data: {
            type: new GraphQLNonNull(graphQLInputCreatePost),
          },
        },
        resolve: async (source: unknown, args) => {
          const { data } = args;
          const postDto: CreatePostDTO = data;

          await assertCreatePost(postDto, fastify);

          const post = await fastify.db.posts.create(postDto);

          return post;
        },
      },
    },
  });

export { getMutation };