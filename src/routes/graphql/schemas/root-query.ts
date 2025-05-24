import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { MemberTypeGQL, MemberTypeIdEnum, MemberTypeNameEnum } from '../types/member-types.js';
import { MemberType, PrismaClient, User } from '@prisma/client';
import DataLoader from 'dataloader';
import { UserTypeGQL } from '../types/user-types.js';
import { UUIDType } from '../types/uuid.js';
import { PostGQL } from '../types/post-types.js';
import { ProfileGQL } from '../types/profile-types.js';

interface Loaders {
  memberLoader: DataLoader<string, MemberType>;
}

export interface GraphQLContext extends Loaders {
  prisma: PrismaClient;
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
      resolve: async (_source, { id }: { id: MemberTypeNameEnum }, { prisma }: GraphQLContext) => {
        const memberType = await prisma.memberType.findUnique({ where: { id } });

        return memberType;
      }
    },
    // users
    users: {
      type: new GraphQLList(UserTypeGQL),
      resolve: async (
        _: unknown,
        __: unknown,
        { prisma }: GraphQLContext,
      ): Promise<User[]> => {
        return prisma.user.findMany();
      },
    },
     user: {
      type: UserTypeGQL,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source, { id }: { id: string }, { prisma }: GraphQLContext) => {
        const memberType = await prisma.user.findUnique({ where: { id } });

        return memberType;
      }
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
      resolve: async (_source, { id }: { id: string }, { prisma }: GraphQLContext) => {
        const post = await prisma.post.findUnique({ where: { id } });

        return post;
      }
    },
    // profiles
    profiles: {
      type: new GraphQLList(ProfileGQL),
      resolve: async (_source, _args, { prisma }: GraphQLContext) => {
        const posts = await prisma.profile.findMany();

        return posts;
      },
    },
    profile: {
      type: ProfileGQL,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_source, { id }: { id: string }, { prisma }: GraphQLContext) => {
        const post = await prisma.profile.findUnique({ where: { id } });

        return post;
      }
    },
  },
});
