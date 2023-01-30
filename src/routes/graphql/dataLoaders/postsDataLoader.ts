import { FastifyInstance } from 'fastify';
import * as DataLoader from 'dataloader';

const getPostsDataLoader = (fastify: FastifyInstance) => {
  const batchPosts = async (keys: any) => {
    const posts = await fastify.db.posts.findMany({ key: 'id', equalsAnyOf: keys });
    const map = keys.map((key: string) => {
      const post = posts.find((u) => u.id === key);
      const result = post ?? null;

      return result;
    });

    return map;
  };
  const dataLoader = new DataLoader(batchPosts);

  return dataLoader;
};

export { getPostsDataLoader };
