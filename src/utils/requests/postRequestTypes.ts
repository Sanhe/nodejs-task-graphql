import { FastifyRequest } from 'fastify';
import { ChangePostDTO, CreatePostDTO } from '../DB/entities/DBPosts';

type CreatePostRequestType = FastifyRequest<{
  Body: CreatePostDTO;
}>;

type ChangePostRequestType = FastifyRequest<{
  Params: {
    id: string;
  };
  Body: ChangePostDTO;
}>;

export { CreatePostRequestType, ChangePostRequestType };
