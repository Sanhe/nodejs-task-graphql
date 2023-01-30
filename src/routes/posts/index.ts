import { constants as httpStatus } from 'http2';
import { FastifyInstance } from 'fastify';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import { RequestWithParamsIdType } from '../../utils/requests/requestTypes';
import { ID_IS_REQUIRED, INTERNAL_SERVER_ERROR, REQUEST_BODY_IS_REQUIRED } from '../../utils/messages/messages';
import { POST_NOT_FOUND } from '../../utils/messages/postMessages';
import { ChangePostRequestType, CreatePostRequestType } from '../../utils/requests/postRequestTypes';
import { NoRequiredEntity } from '../../utils/DB/errors/NoRequireEntity.error';
import { assertCreatePost } from '../../utils/asserts/postAsserts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/', async (): Promise<PostEntity[]> => {
    const posts = await fastify.db.posts.findMany();

    return posts;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request: RequestWithParamsIdType, reply): Promise<PostEntity> => {
      const { id } = request.params;

      fastify.assert(id, httpStatus.HTTP_STATUS_BAD_REQUEST, ID_IS_REQUIRED);

      const post = await fastify.db.posts.findOne({
        key: 'id',
        equals: id,
      });

      fastify.assert(post, httpStatus.HTTP_STATUS_NOT_FOUND, POST_NOT_FOUND);

      return reply.send(post);
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async (request: CreatePostRequestType, reply): Promise<PostEntity> => {
      const postDto = request.body;

      await assertCreatePost(postDto, fastify);

      const post = await fastify.db.posts.create(postDto);

      fastify.assert(post, httpStatus.HTTP_STATUS_BAD_REQUEST, INTERNAL_SERVER_ERROR);

      reply.status(httpStatus.HTTP_STATUS_CREATED);

      return post;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request: RequestWithParamsIdType, reply): Promise<PostEntity> => {
      const { id } = request.params;

      fastify.assert(id, httpStatus.HTTP_STATUS_BAD_REQUEST, ID_IS_REQUIRED);

      let deletedPost;

      try {
        deletedPost = await fastify.db.posts.delete(request.params.id);
      } catch (error) {
        if (error instanceof NoRequiredEntity) {
          fastify.assert(false, httpStatus.HTTP_STATUS_BAD_REQUEST, POST_NOT_FOUND);
        } else {
          throw error;
        }
      }

      fastify.assert(deletedPost, httpStatus.HTTP_STATUS_BAD_REQUEST, INTERNAL_SERVER_ERROR);

      reply.status(httpStatus.HTTP_STATUS_NO_CONTENT);

      return deletedPost;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async (request: ChangePostRequestType): Promise<PostEntity> => {
      const { id } = request.params;
      const postDto = request.body;

      fastify.assert(id, httpStatus.HTTP_STATUS_BAD_REQUEST, ID_IS_REQUIRED);
      fastify.assert(postDto, httpStatus.HTTP_STATUS_BAD_REQUEST, REQUEST_BODY_IS_REQUIRED);

      const post = await fastify.db.posts.findOne({
        key: 'id',
        equals: id,
      });

      fastify.assert(post, httpStatus.HTTP_STATUS_BAD_REQUEST, POST_NOT_FOUND);

      const updatedPost = await fastify.db.posts.change(id, postDto);

      return updatedPost;
    }
  );
};

export default plugin;
