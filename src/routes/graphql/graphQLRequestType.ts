import { FastifyRequest } from 'fastify';

type GraphQLRequestType = FastifyRequest<{
  Body: {
    query: string;
    variables: Record<string, unknown>;
  };
}>;

export { GraphQLRequestType };
