import { FastifyInstance } from 'fastify';
import * as DataLoader from 'dataloader';

const getUsersDataLoader = (fastify: FastifyInstance) => {
  const batchUsers = async (keys: any) => {
    const users = await fastify.db.users.findMany({ key: 'id', equalsAnyOf: keys });
    const map = keys.map((key: string) => {
      const user = users.find((u) => u.id === key);
      const result = user ?? null;

      return result;
    });

    return map;
  };
  const dataLoader = new DataLoader(batchUsers);

  return dataLoader;
};

export { getUsersDataLoader };
