import { FastifyInstance } from 'fastify';
import { UserEntity } from '../DB/entities/DBUsers';

const subscribeUser = async (
  fastify: FastifyInstance,
  subscriber: UserEntity,
  subscribee: UserEntity
): Promise<UserEntity> => {
  subscribee.subscribedToUserIds.push(subscriber.id);
  const subscribedToUserIds = [...new Set(subscribee.subscribedToUserIds)];

  const updatedSubscribee = fastify.db.users.change(subscribee.id, {
    subscribedToUserIds,
  });

  return updatedSubscribee;
};

const unSubscribeUser = async (
  fastify: FastifyInstance,
  subscriber: UserEntity,
  subscribee: UserEntity
): Promise<UserEntity> => {
  const subscribedToUserIds = subscribee.subscribedToUserIds.filter(
    (subscribedToUserId) => subscribedToUserId !== subscriber.id
  );
  const updatedSubscribee = fastify.db.users.change(subscribee.id, {
    subscribedToUserIds,
  });

  return updatedSubscribee;
};

export { subscribeUser, unSubscribeUser };
