import { constants as httpStatus } from 'node:http2';
import { FastifyInstance } from 'fastify';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import { RequestWithParamsIdType } from '../../utils/requests/requestTypes';
import { ID_IS_REQUIRED, REQUEST_BODY_IS_REQUIRED } from '../../utils/messages/messages';
import { MEMBER_TYPE_NOT_FOUND } from '../../utils/messages/memberTypesMessages';
import { ChangeMemberTypeRequestType } from '../../utils/requests/memberTypeRequestTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/', async function (): Promise<MemberTypeEntity[]> {
    const memberTypes = await fastify.db.memberTypes.findMany();

    return memberTypes;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request: RequestWithParamsIdType, reply): Promise<MemberTypeEntity> {
      const { id } = request.params;

      fastify.assert(id, httpStatus.HTTP_STATUS_BAD_REQUEST, ID_IS_REQUIRED);

      const memberType = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: id,
      });

      fastify.assert(memberType, httpStatus.HTTP_STATUS_NOT_FOUND, MEMBER_TYPE_NOT_FOUND);

      return memberType;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request: ChangeMemberTypeRequestType, reply): Promise<MemberTypeEntity> {
      const { id } = request.params;
      const memberTypeDto = request.body;

      fastify.assert(id, httpStatus.HTTP_STATUS_BAD_REQUEST, ID_IS_REQUIRED);
      fastify.assert(memberTypeDto, httpStatus.HTTP_STATUS_BAD_REQUEST, REQUEST_BODY_IS_REQUIRED);

      const memberType = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: id,
      });

      fastify.assert(memberType, httpStatus.HTTP_STATUS_BAD_REQUEST, MEMBER_TYPE_NOT_FOUND);

      const updatedMemberType = await fastify.db.memberTypes.change(id, memberTypeDto);

      return reply.send(updatedMemberType);
    }
  );
};

export default plugin;
