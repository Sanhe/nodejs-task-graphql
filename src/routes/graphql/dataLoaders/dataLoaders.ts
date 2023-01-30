import { FastifyInstance } from 'fastify';
import { getUsersDataLoader } from './usersDataLoader';
import { getProfilesDataLoader } from './profilesDataLoader';
import { getPostsDataLoader } from './postsDataLoader';
import { getMemberTypesDataLoader } from './memberTypesDataLoader';
import { getPostsByUserIdDataLoader } from './postsByUserIdDataLoader';
import { getProfilesByUserIdDataLoader } from './profilesByUserIdDataLoader';
import { usersBySubscribedToUserIdsDataLoader } from './usersBySubscribedToUserIdsDataLoader';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';
import { MemberTypeEntity } from '../../../utils/DB/entities/DBMemberTypes';

const getDataLoader = (fastify: FastifyInstance) => {
  const users = getUsersDataLoader(fastify);
  const profiles = getProfilesDataLoader(fastify);
  const posts = getPostsDataLoader(fastify);
  const memberTypes = getMemberTypesDataLoader(fastify);

  const postsByUserId = getPostsByUserIdDataLoader(fastify);
  const profileByUserId = getProfilesByUserIdDataLoader(fastify);

  const usersBySubscribedToUserIds = usersBySubscribedToUserIdsDataLoader(fastify);

  const primeManyUsers = (freshUsers: UserEntity[]) => {
    freshUsers.forEach((user) => {
      users.prime(user.id, user);
    });
  };
  const primeManyProfiles = (freshProfiles: ProfileEntity[]) => {
    freshProfiles.forEach((profile) => {
      profiles.prime(profile.id, profile);
    });
  };
  const primeManyPosts = (freshPosts: PostEntity[]) => {
    freshPosts.forEach((post) => {
      posts.prime(post.id, post);
    });
  };
  const primeMemberTypes = (freshMemberTypes: MemberTypeEntity[]) => {
    freshMemberTypes.forEach((memberType) => {
      memberTypes.prime(memberType.id, memberType);
    });
  };

  return {
    users,
    profiles,
    posts,
    memberTypes,
    postsByUserId,
    profileByUserId,
    usersBySubscribedToUserIds,
    primeManyUsers,
    primeManyProfiles,
    primeManyPosts,
    primeMemberTypes,
  };
};

export { getDataLoader };
