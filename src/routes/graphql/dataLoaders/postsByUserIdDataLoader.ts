import { FastifyInstance } from 'fastify';
import * as DataLoader from 'dataloader';

const getPostsByUserIdDataLoader = (fastify: FastifyInstance) => {
  const batchPosts = async (keys: any) => {
    const posts = await fastify.db.posts.findMany({ key: 'userId', equalsAnyOf: keys });
    const map = keys.map((key: string) => {
      const userPosts = posts.filter((p) => p.userId === key);
      const result = userPosts ?? [];

      return result;
    });

    return map;
  };
  const dataLoader = new DataLoader(batchPosts);

  return dataLoader;
};

export { getPostsByUserIdDataLoader };
