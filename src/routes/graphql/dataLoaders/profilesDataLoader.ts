import { FastifyInstance } from 'fastify';
import * as DataLoader from 'dataloader';

const getProfilesDataLoader = (fastify: FastifyInstance) => {
  const batchProfiles = async (keys: any) => {
    const profiles = await fastify.db.profiles.findMany({ key: 'id', equalsAnyOf: keys });
    const map = keys.map((key: string) => {
      const profile = profiles.find((p) => p.id === key);
      const result = profile ?? null;

      return result;
    });

    return map;
  };
  const dataLoader = new DataLoader(batchProfiles);

  return dataLoader;
};

export { getProfilesDataLoader };
