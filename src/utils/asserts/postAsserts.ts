import { FastifyInstance } from 'fastify';
import { assertUserByIdExists } from './userAsserts';
import { USER_WITH_ID_NOT_FOUND } from '../messages/userMessages';
import { CreatePostDTO } from '../DB/entities/DBPosts';

async function assertCreatePost(
  postDto: CreatePostDTO,
  fastify: FastifyInstance
  // @ts-ignore
): Promise<asserts profileDto is CreatePostDTO> {
  await assertUserByIdExists(postDto.userId, USER_WITH_ID_NOT_FOUND, fastify);
}

export { assertCreatePost };
