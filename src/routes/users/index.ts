import { constants as httpStatus } from 'node:http2';
import { FastifyInstance } from 'fastify';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createUserBodySchema, changeUserBodySchema, subscribeBodySchema } from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { RequestWithParamsIdType } from '../../utils/requests/requestTypes';
import {
  ChangeUserRequestType,
  CreateUserRequestType,
  SubscribeUserRequestType,
  UnSubscribeUserRequestType,
} from '../../utils/requests/userRequestTypes';
import {
  USER_ID_IS_REQUIRED,
  SUBSCRIBE_TO_USER_NOT_FOUND,
  USER_NOT_FOUND,
  USER_NOT_SUBSCRIBED,
} from '../../utils/messages/userMessages';
import { ID_IS_REQUIRED, INTERNAL_SERVER_ERROR, REQUEST_BODY_IS_REQUIRED } from '../../utils/messages/messages';
import { NoRequiredEntity } from '../../utils/DB/errors/NoRequireEntity.error';
import { subscribeUser, unSubscribeUser } from '../../utils/handlers/subscriptionHandlers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/', async (): Promise<UserEntity[]> => {
    const users = await fastify.db.users.findMany();

    return users;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request: RequestWithParamsIdType): Promise<UserEntity> => {
      const { id } = request.params;

      fastify.assert(id, httpStatus.HTTP_STATUS_BAD_REQUEST, ID_IS_REQUIRED);

      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      fastify.assert(user, httpStatus.HTTP_STATUS_NOT_FOUND, USER_NOT_FOUND);

      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async (request: CreateUserRequestType, reply): Promise<UserEntity> => {
      const userDto = request.body;

      const user = await fastify.db.users.create(userDto);

      fastify.assert(user, httpStatus.HTTP_STATUS_BAD_REQUEST, INTERNAL_SERVER_ERROR);

      reply.status(httpStatus.HTTP_STATUS_CREATED);

      return user;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request: RequestWithParamsIdType, reply): Promise<UserEntity> => {
      const { id } = request.params;

      fastify.assert(id, httpStatus.HTTP_STATUS_BAD_REQUEST, ID_IS_REQUIRED);

      const userToDelete = await fastify.db.users.findOne({
        key: 'id',
        equals: id,
      });

      fastify.assert(userToDelete, httpStatus.HTTP_STATUS_BAD_REQUEST, USER_NOT_FOUND);

      try {
        const deletedEntities = [];

        const userPosts = await fastify.db.posts.findMany({
          key: 'userId',
          equals: id,
        });
        const deletedUserPosts = userPosts.map(async (post) => {
          return fastify.db.posts.delete(post.id);
        });
        deletedEntities.push(...deletedUserPosts);

        const userSubscriptions = await fastify.db.users.findMany({
          key: 'subscribedToUserIds',
          inArray: id,
        });
        const deletedSubscriptions = userSubscriptions.map(async (subscriptionUser) => {
          return unSubscribeUser(fastify, userToDelete, subscriptionUser);
        });
        deletedEntities.push(...deletedSubscriptions);

        const userProfile = await fastify.db.profiles.findOne({
          key: 'userId',
          equals: id,
        });
        if (userProfile) {
          const deletedUserProfile = fastify.db.profiles.delete(userProfile.id);
          deletedEntities.push(deletedUserProfile);
        }

        const deletedUser = fastify.db.users.delete(id);
        deletedEntities.push(deletedUser);

        await Promise.all(deletedEntities);
      } catch (error) {
        if (error instanceof NoRequiredEntity) {
          fastify.assert(false, httpStatus.HTTP_STATUS_BAD_REQUEST, USER_NOT_FOUND);
        } else {
          throw error;
        }
      }

      reply.status(httpStatus.HTTP_STATUS_NO_CONTENT);

      return userToDelete;
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async (request: SubscribeUserRequestType): Promise<UserEntity> => {
      const { id } = request.params;
      const { userId } = request.body;

      fastify.assert(id, httpStatus.HTTP_STATUS_BAD_REQUEST, ID_IS_REQUIRED);
      fastify.assert(userId, httpStatus.HTTP_STATUS_BAD_REQUEST, USER_ID_IS_REQUIRED);

      const subscriber = await fastify.db.users.findOne({
        key: 'id',
        equals: id,
      });

      fastify.assert(subscriber, httpStatus.HTTP_STATUS_BAD_REQUEST, USER_NOT_FOUND);

      const subscribeToUser = await fastify.db.users.findOne({
        key: 'id',
        equals: userId,
      });

      fastify.assert(subscribeToUser, httpStatus.HTTP_STATUS_BAD_REQUEST, SUBSCRIBE_TO_USER_NOT_FOUND);

      const updatedSubscribee = subscribeUser(fastify, subscriber, subscribeToUser);

      return updatedSubscribee;
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async (request: UnSubscribeUserRequestType): Promise<UserEntity> => {
      const { id } = request.params;
      const { userId } = request.body;

      fastify.assert(id, httpStatus.HTTP_STATUS_BAD_REQUEST, ID_IS_REQUIRED);
      fastify.assert(userId, httpStatus.HTTP_STATUS_BAD_REQUEST, USER_ID_IS_REQUIRED);

      const subscriber = await fastify.db.users.findOne({
        key: 'id',
        equals: id,
      });

      fastify.assert(subscriber, httpStatus.HTTP_STATUS_BAD_REQUEST, USER_NOT_FOUND);

      const unsubscribeFromUser = await fastify.db.users.findOne({
        key: 'id',
        equals: userId,
      });

      fastify.assert(unsubscribeFromUser, httpStatus.HTTP_STATUS_BAD_REQUEST, USER_NOT_FOUND);

      const isSubscribed = unsubscribeFromUser.subscribedToUserIds.includes(subscriber.id);

      fastify.assert(isSubscribed, httpStatus.HTTP_STATUS_BAD_REQUEST, USER_NOT_SUBSCRIBED);

      const subscribedUserIdIndex = unsubscribeFromUser.subscribedToUserIds.findIndex(
        (subscriberUserId) => subscriberUserId === subscriber.id
      );
      unsubscribeFromUser.subscribedToUserIds.splice(subscribedUserIdIndex, 1);

      const updatedUser = await fastify.db.users.change(unsubscribeFromUser.id, {
        subscribedToUserIds: unsubscribeFromUser.subscribedToUserIds,
      });

      return updatedUser;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async (request: ChangeUserRequestType): Promise<UserEntity> => {
      const { id } = request.params;
      const userDto = request.body;

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
    }
  );
};

export default plugin;
