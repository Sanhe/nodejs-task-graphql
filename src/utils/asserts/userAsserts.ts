import { constants as httpStatus } from 'node:http2';
import { FastifyInstance } from 'fastify';

async function assertUserByIdExists(
  userId: string,
  message: string,
  fastify: FastifyInstance
  // @ts-ignore
): Promise<asserts userId is number> {
  const user = await fastify.db.users.findOne({
    key: 'id',
    equals: userId,
  });

  fastify.assert(user, httpStatus.HTTP_STATUS_BAD_REQUEST, message);
}

export { assertUserByIdExists };
