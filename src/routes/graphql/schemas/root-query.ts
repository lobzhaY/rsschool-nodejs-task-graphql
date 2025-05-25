import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
} from 'graphql';
import {
  MemberTypeGQL,
  MemberTypeIdEnum,
  MemberTypeNameEnum,
} from '../types/query/member-types.js';
import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';
import DataLoader from 'dataloader';
import { UserTypeGQL } from '../types/query/user-types.js';
import { UUIDType } from '../types/uuid.js';
import { PostGQL } from '../types/query/post-types.js';
import { ProfileGQL } from '../types/query/profile-types.js';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

interface Loaders {
  memberLoader: DataLoader<string, MemberType>;
  usersLoader: DataLoader<string, User>;
  userSubscribedToLoader: DataLoader<string, User[]>;
  subscribedToUserLoader: DataLoader<string, User[]>;
  profileLoader: DataLoader<string, Profile>;
  profileByUserIdLoader: DataLoader<string, Profile>;
  postLoader: DataLoader<string, Post>;
  postLoaderByAuthorIdLoader: DataLoader<string, Post>;
}

export interface GraphQLContext {
  prisma: PrismaClient;
  loaders: Loaders;
}

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // members
    memberTypes: {
      type: new GraphQLList(MemberTypeGQL),
      resolve: async (
        _: unknown,
        __: unknown,
        { prisma }: GraphQLContext,
      ): Promise<MemberType[]> => {
        return prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberTypeGQL,
      args: { id: { type: new GraphQLNonNull(MemberTypeIdEnum) } },
      resolve: async (
        _source,
        { id }: { id: MemberTypeNameEnum },
        { loaders }: GraphQLContext,
      ) => {
        return await loaders.memberLoader.load(id);
      },
    },
    // users
    users: {
      type: new GraphQLList(UserTypeGQL),
      resolve: async (
        _: unknown,
        __: unknown,
        { prisma, loaders }: GraphQLContext,
        resolveInfo: GraphQLResolveInfo,
      ): Promise<User[]> => {
        const parsedInfo = parseResolveInfo(resolveInfo) as ResolveTree;
        const { fields } = simplifyParsedResolveInfoFragmentWithType(
          parsedInfo,
          UserTypeGQL,
        );

        const shouldIncludeUserSubscribedTo = 'userSubscribedTo' in fields;
        const shouldIncludeSubscribedToUser = 'subscribedToUser' in fields;

        const users = await prisma.user.findMany({
          include: {
            userSubscribedTo: shouldIncludeUserSubscribedTo,
            subscribedToUser: shouldIncludeSubscribedToUser,
          },
        });

        const userById = new Map(users.map((user) => [user.id, user]));

        for (const user of users) {
          if (shouldIncludeUserSubscribedTo) {
            const subscriptions = user.userSubscribedTo
              .map((sub) => userById.get(sub.authorId))
              .filter(Boolean) as User[];
            loaders.userSubscribedToLoader.prime(user.id, subscriptions);
          }

          if (shouldIncludeSubscribedToUser) {
            const subscribers = user.subscribedToUser
              .map((sub) => userById.get(sub.subscriberId))
              .filter(Boolean) as User[];
            loaders.subscribedToUserLoader.prime(user.id, subscribers);
          }
        }

        return users;
      },
    },
    user: {
      type: UserTypeGQL,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source, { id }: { id: string }, { loaders }: GraphQLContext) => {
        return await loaders.usersLoader.load(id);
      },
    },
    // posts
    posts: {
      type: new GraphQLList(PostGQL),
      resolve: async (_source, _args, { prisma }: GraphQLContext) => {
        const posts = await prisma.post.findMany();

        return posts;
      },
    },
    post: {
      type: PostGQL,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source, { id }: { id: string }, { loaders }: GraphQLContext) => {
        return await loaders.postLoader.load(id);
      },
    },
    // profiles
    profiles: {
      type: new GraphQLList(ProfileGQL),
      resolve: async (_source, _args, { prisma }: GraphQLContext) => {
        const profile = await prisma.profile.findMany();

        return profile;
      },
    },
    profile: {
      type: ProfileGQL,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source, { id }: { id: string }, { loaders }: GraphQLContext) => {
        return loaders.profileLoader.load(id);
      },
    },
  },
});
