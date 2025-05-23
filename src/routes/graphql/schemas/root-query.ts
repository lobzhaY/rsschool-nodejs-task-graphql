import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { MemberTypeGQL, MemberTypeIdEnum, MemberTypeNameEnum } from '../types/member-types.js';
import { MemberType, PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

interface Loaders {
  memberLoader: DataLoader<string, MemberType>;
}

export interface GraphQLContext extends Loaders {
  prisma: PrismaClient;
}

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {

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
  },
});
