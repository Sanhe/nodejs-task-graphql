import { FastifyRequest } from 'fastify';

type GraphQLRequestType = FastifyRequest<{
  Body: {
    query: string;
  };
}>;

export { GraphQLRequestType };
