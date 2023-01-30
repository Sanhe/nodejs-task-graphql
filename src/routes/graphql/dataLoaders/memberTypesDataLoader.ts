import { FastifyInstance } from 'fastify';
import * as DataLoader from 'dataloader';

const getMemberTypesDataLoader = (fastify: FastifyInstance) => {
  const batchMemberTypes = async (keys: any) => {
    const memberTypes = await fastify.db.memberTypes.findMany({ key: 'id', equalsAnyOf: keys });
    const map = keys.map((key: string) => {
      const memberType = memberTypes.find((u) => u.id === key);
      const result = memberType ?? null;

      return result;
    });

    return map;
  };
  const dataLoader = new DataLoader(batchMemberTypes);

  return dataLoader;
};

export { getMemberTypesDataLoader };
