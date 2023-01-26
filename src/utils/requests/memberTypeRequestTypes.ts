import { FastifyRequest } from 'fastify';
import { ChangeMemberTypeDTO } from '../DB/entities/DBMemberTypes';

type ChangeMemberTypeRequestType = FastifyRequest<{
  Params: {
    id: string;
  };
  Body: ChangeMemberTypeDTO;
}>;

export { ChangeMemberTypeRequestType };
