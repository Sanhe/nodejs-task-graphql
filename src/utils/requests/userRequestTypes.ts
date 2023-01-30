import { FastifyRequest } from 'fastify';
import { ChangeUserDTO, CreateUserDTO } from '../DB/entities/DBUsers';

type CreateUserRequestType = FastifyRequest<{
  Body: CreateUserDTO;
}>;

type ChangeUserRequestType = FastifyRequest<{
  Params: {
    id: string;
  };
  Body: ChangeUserDTO;
}>;

type SubscribeUserRequestType = FastifyRequest<{
  Params: {
    id: string;
  };
  Body: {
    userId: string;
  };
}>;

type UnSubscribeUserRequestType = SubscribeUserRequestType;

export { CreateUserRequestType, ChangeUserRequestType, SubscribeUserRequestType, UnSubscribeUserRequestType };
