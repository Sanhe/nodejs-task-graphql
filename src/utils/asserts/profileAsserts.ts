import { constants as httpStatus } from 'node:http2';
import { FastifyInstance } from 'fastify';
import { CreateProfileDTO } from '../DB/entities/DBProfiles';
import { REQUEST_BODY_IS_REQUIRED } from '../messages/messages';
import {
  PROFILE_MEMBER_TYPE_ID_IS_REQUIRED,
  PROFILE_USER_ID_IS_REQUIRED,
  PROFILE_WITH_THIS_USER_ID_ALREADY_EXISTS,
} from '../messages/profileMessages';
import { MEMBER_TYPE_NOT_FOUND } from '../messages/memberTypesMessages';
import { assertUserByIdExists } from './userAsserts';
import { USER_WITH_ID_NOT_FOUND } from '../messages/userMessages';

async function assertCreateProfile(
  profileDto: CreateProfileDTO,
  fastify: FastifyInstance
  // @ts-ignore
): Promise<asserts profileDto is CreateProfileDTO> {
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

  await assertUserByIdExists(profileDto.userId, USER_WITH_ID_NOT_FOUND, fastify);
}

export { assertCreateProfile };
