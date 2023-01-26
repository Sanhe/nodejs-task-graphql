import { FastifyRequest } from 'fastify';
import { ChangeProfileDTO, CreateProfileDTO } from '../DB/entities/DBProfiles';

type CreateProfileRequestTypes = FastifyRequest<{
  Body: CreateProfileDTO;
}>;

type ChangeProfileRequestTypes = FastifyRequest<{
  Params: {
    id: string;
  };
  Body: ChangeProfileDTO;
}>;

export { CreateProfileRequestTypes, ChangeProfileRequestTypes };
