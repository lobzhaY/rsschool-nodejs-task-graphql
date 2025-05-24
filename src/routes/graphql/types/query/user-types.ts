import {
  GraphQLFieldConfigMap,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLType,
} from 'graphql';
import { UUIDType } from '../uuid.js';
import { ProfileGQL } from './profile-types.js';
import { PostGQL } from './post-types.js';
import { User } from '@prisma/client';
import { GraphQLContext } from '../../schemas/root-query.js';

const NonNullListOf = <T extends GraphQLType>(type: T) =>
  new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(type)));

export const UserTypeGQL: GraphQLObjectType<User, GraphQLContext> = new GraphQLObjectType(
  {
    name: 'UserTypeGQL',
    fields: (): GraphQLFieldConfigMap<User, GraphQLContext> => {
      return {
        id: { type: new GraphQLNonNull(UUIDType) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
        profile: {
          type: ProfileGQL,
          resolve: async ({ id }, _args, { prisma }) => {
            return prisma.profile.findUnique({ where: { userId: id } });
          },
        },
        posts: {
          type: NonNullListOf(PostGQL),
          resolve: async ({ id }, _args, { prisma }) => {
            const posts = await prisma.post.findMany({ where: { authorId: id } });

            return posts;
          },
        },
        userSubscribedTo: {
          type: NonNullListOf(UserTypeGQL),
          resolve: async ({ id }, _args, { prisma }) => {
            const subscriptions = await prisma.subscribersOnAuthors.findMany({
              where: { subscriberId: id },
              include: { author: true },
            });

            return subscriptions.map((subscription) => subscription.author);
          },
        },
        subscribedToUser: {
          type: NonNullListOf(UserTypeGQL),
          resolve: async ({ id }, _args, { prisma }) => {
            const subscriptions = await prisma.subscribersOnAuthors.findMany({
              where: { authorId: id },
              include: { subscriber: true },
            });

            return subscriptions.map((sub) => sub.subscriber);
          },
        },
      };
    },
  },
);
