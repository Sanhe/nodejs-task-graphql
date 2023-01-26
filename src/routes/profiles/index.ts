import { constants as httpStatus } from 'node:http2';
import { FastifyInstance } from 'fastify';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { RequestWithParamsIdType } from '../../utils/requests/requestTypes';
import { ID_IS_REQUIRED, INTERNAL_SERVER_ERROR, REQUEST_BODY_IS_REQUIRED } from '../../utils/messages/messages';
import {
  PROFILE_MEMBER_TYPE_ID_IS_REQUIRED,
  PROFILE_NOT_FOUND,
  PROFILE_USER_ID_IS_REQUIRED,
  PROFILE_WITH_THIS_USER_ID_ALREADY_EXISTS,
} from '../../utils/messages/profileMessages';
import { ChangeProfileRequestTypes, CreateProfileRequestTypes } from '../../utils/requests/profileRequestTypes';
import { NoRequiredEntity } from '../../utils/DB/errors/NoRequireEntity.error';
import { MEMBER_TYPE_NOT_FOUND } from '../../utils/messages/memberTypesMessages';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/', async (): Promise<ProfileEntity[]> => {
    const profiles = await fastify.db.profiles.findMany();

    return profiles;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request: RequestWithParamsIdType): Promise<ProfileEntity> => {
      const { id } = request.params;

      fastify.assert(id, httpStatus.HTTP_STATUS_BAD_REQUEST, ID_IS_REQUIRED);

      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: id,
      });

      fastify.assert(profile, httpStatus.HTTP_STATUS_NOT_FOUND, PROFILE_NOT_FOUND);

      return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async (request: CreateProfileRequestTypes, reply): Promise<ProfileEntity> => {
      const profileDto = request.body;

      fastify.assert(profileDto, httpStatus.HTTP_STATUS_BAD_REQUEST, REQUEST_BODY_IS_REQUIRED);
      fastify.assert(profileDto.memberTypeId, httpStatus.HTTP_STATUS_BAD_REQUEST, PROFILE_MEMBER_TYPE_ID_IS_REQUIRED);
      fastify.assert(profileDto.userId, httpStatus.HTTP_STATUS_BAD_REQUEST, PROFILE_USER_ID_IS_REQUIRED);

      const memberType = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: profileDto.memberTypeId,
      });

      fastify.assert(memberType, httpStatus.HTTP_STATUS_BAD_REQUEST, MEMBER_TYPE_NOT_FOUND);

      const existingProfile = await fastify.db.profiles.findOne({
        key: 'userId',
        equals: profileDto.userId,
      });

      fastify.assert(!existingProfile, httpStatus.HTTP_STATUS_BAD_REQUEST, PROFILE_WITH_THIS_USER_ID_ALREADY_EXISTS);

      const profile = await fastify.db.profiles.create(profileDto);

      fastify.assert(profile, httpStatus.HTTP_STATUS_BAD_REQUEST, INTERNAL_SERVER_ERROR);

      reply.status(httpStatus.HTTP_STATUS_CREATED);

      return profile;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async (request: RequestWithParamsIdType, reply): Promise<ProfileEntity> => {
      const { id } = request.params;

      fastify.assert(id, httpStatus.HTTP_STATUS_BAD_REQUEST, ID_IS_REQUIRED);

      let profile;

      try {
        profile = await fastify.db.profiles.delete(id);
      } catch (error) {
        if (error instanceof NoRequiredEntity) {
          fastify.assert(false, httpStatus.HTTP_STATUS_BAD_REQUEST, PROFILE_NOT_FOUND);
        } else {
          throw error;
        }
      }

      reply.status(httpStatus.HTTP_STATUS_NO_CONTENT);

      return profile;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async (request: ChangeProfileRequestTypes): Promise<ProfileEntity> => {
      const { id } = request.params;
      const profileDto = request.body;

      fastify.assert(id, httpStatus.HTTP_STATUS_BAD_REQUEST, ID_IS_REQUIRED);
      fastify.assert(profileDto, httpStatus.HTTP_STATUS_BAD_REQUEST, REQUEST_BODY_IS_REQUIRED);

      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: id,
      });

      fastify.assert(profile, httpStatus.HTTP_STATUS_BAD_REQUEST, PROFILE_NOT_FOUND);

      const updatedProfile = await fastify.db.profiles.change(id, profileDto);

      return updatedProfile;
    }
  );
};

export default plugin;
