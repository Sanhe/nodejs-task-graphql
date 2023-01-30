import { FastifyInstance } from 'fastify';
import * as DataLoader from 'dataloader';

const getProfilesByUserIdDataLoader = (fastify: FastifyInstance) => {
  const batchPosts = async (keys: any) => {
    const profiles = await fastify.db.profiles.findMany({ key: 'userId', equalsAnyOf: keys });
    const map = keys.map((key: string) => {
      const profile = profiles.find((p) => p.userId === key);
      const result = profile ?? null;

      return result;
    });

    return map;
  };
  const dataLoader = new DataLoader(batchPosts);

  return dataLoader;
};

export { getProfilesByUserIdDataLoader };
