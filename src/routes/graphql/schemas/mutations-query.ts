import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UserTypeGQL } from '../types/query/user-types.js';
import {
  ChangeUserInputGQL,
  CreateUserInputGQL,
  UserInputDto,
} from '../types/mutations/user-types.js';
import { GraphQLContext } from './root-query.js';
import { UUIDType } from '../types/uuid.js';

export const Mutations = new GraphQLObjectType({
  name: 'MutationsQueryType',
  fields: {
    // user
    createUser: {
      type: UserTypeGQL,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInputGQL) },
      },
      resolve: async (
        _source,
        { dto }: { dto: UserInputDto },
        { prisma }: GraphQLContext,
      ) => {
        const newUser = await prisma.user.create({
          data: dto,
        });
        return newUser;
      },
    },
    changeUser: {
      type: UserTypeGQL,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInputGQL) },
      },
      resolve: async (
        _source,
        { id, dto }: { id: string; dto: Partial<UserInputDto> },
        { prisma }: GraphQLContext,
      ) => {
        const newUser = await prisma.user.update({
          where: { id },
          data: dto,
        });

        return newUser;
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, { id }: { id: string }, { prisma }: GraphQLContext) => {
        const deletedUser = await prisma.user.delete({
          where: { id },
          select: { id: true },
        });
        return deletedUser.id;
      },
    },
  },
});
