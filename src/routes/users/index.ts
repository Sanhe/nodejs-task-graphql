import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createUserBodySchema, changeUserBodySchema, subscribeBodySchema } from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
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
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!user) {
        throw fastify.httpErrors.notFound();
      }

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
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.create(request.body);

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
    async function (request, reply): Promise<UserEntity> {
      const deletedUser = await fastify.db.users.delete(request.params.id);

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
    async function (request, reply): Promise<UserEntity> {
      const subscriber = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!subscriber) {
        throw fastify.httpErrors.badRequest();
      }

      const subscribeToUser = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (!subscribeToUser) {
        throw fastify.httpErrors.badRequest();
      }

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
    async function (request, reply): Promise<UserEntity> {
      const unsubscriber = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!unsubscriber) {
        throw fastify.httpErrors.badRequest();
      }

      const unsubscribeFromUser = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (!unsubscribeFromUser) {
        throw fastify.httpErrors.badRequest();
      }

      const subscribedUserIdIndex = unsubscribeFromUser.subscribedToUserIds.findIndex(
        (userId) => userId === unsubscriber.id
      );
      const subscribedToUserIds = unsubscribeFromUser.subscribedToUserIds.splice(subscribedUserIdIndex, 1);

      const updatedUser = await fastify.db.users.change(unsubscribeFromUser.id, {
        subscribedToUserIds,
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
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!user) {
        throw fastify.httpErrors.badRequest();
      }

      const updatedUser = await fastify.db.users.change(request.params.id, {
        ...request.body,
      });

      return reply.send(updatedUser);
    }
  );
};

export default plugin;
