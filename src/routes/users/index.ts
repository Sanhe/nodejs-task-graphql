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
import { BAD_REQUEST_STATUS_CODE, NOT_FOUND_STATUS_CODE } from '../../utils/requests/requestStatusCodes';
import { NoRequiredEntity } from '../../utils/DB/errors/NoRequireEntity.error';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    const users = await fastify.db.users.findMany();

    return reply.send(users);
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request: RequestWithParamsIdType, reply): Promise<UserEntity> {
      const { id } = request.params;

      fastify.assert(id, BAD_REQUEST_STATUS_CODE, ID_IS_REQUIRED);

      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      fastify.assert(user, NOT_FOUND_STATUS_CODE, USER_NOT_FOUND);

      return reply.send(user);
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request: CreateUserRequestType, reply): Promise<UserEntity> {
      const userDto = request.body;

      fastify.assert(userDto, BAD_REQUEST_STATUS_CODE, REQUEST_BODY_IS_REQUIRED);

      const user = await fastify.db.users.create(userDto);

      fastify.assert(user, BAD_REQUEST_STATUS_CODE, INTERNAL_SERVER_ERROR);

      return reply.send(user);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request: RequestWithParamsIdType, reply): Promise<UserEntity> {
      const { id } = request.params;

      fastify.assert(id, BAD_REQUEST_STATUS_CODE, ID_IS_REQUIRED);

      let deletedUser;

      try {
        deletedUser = await fastify.db.users.delete(id);
      } catch (error) {
        if (error instanceof NoRequiredEntity) {
          fastify.assert(false, BAD_REQUEST_STATUS_CODE, USER_NOT_FOUND);
        } else {
          throw error;
        }
      }

      fastify.assert(deletedUser, BAD_REQUEST_STATUS_CODE, INTERNAL_SERVER_ERROR);

      return reply.send(deletedUser);
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
    async function (request: SubscribeUserRequestType, reply): Promise<UserEntity> {
      const { id } = request.params;
      const { userId } = request.body;

      fastify.assert(id, BAD_REQUEST_STATUS_CODE, ID_IS_REQUIRED);
      fastify.assert(userId, BAD_REQUEST_STATUS_CODE, USER_ID_IS_REQUIRED);

      const subscriber = await fastify.db.users.findOne({
        key: 'id',
        equals: id,
      });

      fastify.assert(subscriber, BAD_REQUEST_STATUS_CODE, USER_NOT_FOUND);

      const subscribeToUser = await fastify.db.users.findOne({
        key: 'id',
        equals: userId,
      });

      fastify.assert(subscribeToUser, BAD_REQUEST_STATUS_CODE, SUBSCRIBE_TO_USER_NOT_FOUND);

      const subscribedToUserIds = [...subscribeToUser.subscribedToUserIds, subscriber.id];

      const updatedUser = await fastify.db.users.change(subscribeToUser.id, {
        subscribedToUserIds,
      });

      return reply.send(updatedUser);
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
    async function (request: UnSubscribeUserRequestType, reply): Promise<UserEntity> {
      const { id } = request.params;
      const { userId } = request.body;

      fastify.assert(id, BAD_REQUEST_STATUS_CODE, ID_IS_REQUIRED);
      fastify.assert(userId, BAD_REQUEST_STATUS_CODE, USER_ID_IS_REQUIRED);

      const subscriber = await fastify.db.users.findOne({
        key: 'id',
        equals: id,
      });

      fastify.assert(subscriber, BAD_REQUEST_STATUS_CODE, USER_NOT_FOUND);

      const unsubscribeFromUser = await fastify.db.users.findOne({
        key: 'id',
        equals: userId,
      });

      fastify.assert(unsubscribeFromUser, BAD_REQUEST_STATUS_CODE, USER_NOT_FOUND);

      const isSubscribed = unsubscribeFromUser.subscribedToUserIds.includes(subscriber.id);

      fastify.assert(isSubscribed, BAD_REQUEST_STATUS_CODE, USER_NOT_SUBSCRIBED);

      const subscribedUserIdIndex = unsubscribeFromUser.subscribedToUserIds.findIndex(
        (subscriberUserId) => subscriberUserId === subscriber.id
      );
      unsubscribeFromUser.subscribedToUserIds.splice(subscribedUserIdIndex, 1);

      const updatedUser = await fastify.db.users.change(unsubscribeFromUser.id, {
        subscribedToUserIds: unsubscribeFromUser.subscribedToUserIds,
      });

      return reply.send(updatedUser);
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
    async function (request: ChangeUserRequestType, reply): Promise<UserEntity> {
      const { id } = request.params;
      const userDto = request.body;

      fastify.assert(id, BAD_REQUEST_STATUS_CODE, ID_IS_REQUIRED);
      fastify.assert(userDto, BAD_REQUEST_STATUS_CODE, REQUEST_BODY_IS_REQUIRED);

      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: id,
      });

      fastify.assert(user, BAD_REQUEST_STATUS_CODE, USER_NOT_FOUND);

      const updatedUser = await fastify.db.users.change(id, {
        ...userDto,
      });

      return reply.send(updatedUser);
    }
  );
};

export default plugin;
