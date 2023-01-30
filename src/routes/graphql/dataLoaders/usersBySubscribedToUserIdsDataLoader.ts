import { FastifyInstance } from 'fastify';
import * as DataLoader from 'dataloader';

const usersBySubscribedToUserIdsDataLoader = (fastify: FastifyInstance) => {
  const batchUsers = async (keys: any) => {
    const usersSubscribedTo = await fastify.db.users.findMany({ key: 'subscribedToUserIds', inArrayAnyOf: keys });
    const map = keys.map((key: string) => {
      const users = usersSubscribedTo.filter((u) => u.subscribedToUserIds.includes(key));
      const result = users ?? [];

      return result;
    });

    return map;
  };
  const dataLoader = new DataLoader(batchUsers);

  return dataLoader;
};

export { usersBySubscribedToUserIdsDataLoader };
