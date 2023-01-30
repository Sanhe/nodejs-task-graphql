import { FastifyRequest } from 'fastify';

type RequestWithParamsIdType = FastifyRequest<{
  Params: {
    id: string;
  };
}>;

export { RequestWithParamsIdType };
