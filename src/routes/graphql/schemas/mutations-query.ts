import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UserTypeGQL } from '../types/query/user-types.js';
import {
  ChangeUserInputGQL,
  CreateUserInputGQL,
  UserInputDto,
} from '../types/mutations/user-types.js';
import { GraphQLContext } from './root-query.js';
import { UUIDType } from '../types/uuid.js';
import { ProfileGQL } from '../types/query/profile-types.js';
import {
  ChangeProfileInputGQL,
  CreateProfileInputGQL,
  ProfileInputDto,
} from '../types/mutations/profile-types.js';
import { PostGQL } from '../types/query/post-types.js';
import { ChangePostInputDto, ChangePostInputGQL, CreatePostInputDto, CreatePostInputGQL } from '../types/mutations/post-types.js';

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
    // profile
    createProfile: {
      type: ProfileGQL,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInputGQL) },
      },
      resolve: async (
        _source,
        { dto }: { dto: ProfileInputDto },
        { prisma }: GraphQLContext,
      ) => {
        const existingProfile = await prisma.profile.findUnique({
          where: { userId: dto.userId },
        });

        if (existingProfile) {
          throw new Error(`User ${dto.userId} already has a profile.`);
        }
        const newProfile = await prisma.profile.create({
          data: dto,
        });
        return newProfile;
      },
    },
    changeProfile: {
      type: ProfileGQL,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInputGQL) },
      },
      resolve:  async (
        _source,
        { dto, id }: { id: string; dto: ProfileInputDto },
        { prisma }: GraphQLContext,
      ) => {
        const existingProfile = await prisma.profile.findUnique({ where: { id } });

        if (!existingProfile) {
          throw new Error(`Profile with id "${id}" not found.`);
        }
        const updateProfile = await prisma.profile.update({
          where: { id },
          data: dto,
        });

        return updateProfile;
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, { id }: { id: string }, { prisma }: GraphQLContext) => {
        const deletedProfile = await prisma.profile.delete({
          where: { id },
          select: { id: true },
        });
        return deletedProfile.id;
      },
    },
    // post
    createPost: {
      type: PostGQL,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInputGQL) },
      },
      resolve: async (
        _source,
        { dto }: { dto: CreatePostInputDto },
        { prisma }: GraphQLContext,
      ) => {
        const newPost = await prisma.post.create({
          data: dto,
        });
        return newPost;
      },
    },
    changePost: {
      type: PostGQL,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInputGQL) },
      },
      resolve:  async (
        _source,
        { dto, id }: { id: string; dto: ChangePostInputDto },
        { prisma }: GraphQLContext,
      ) => {
        const updatePost = await prisma.post.update({
          where: { id },
          data: dto,
        });

        return updatePost;
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, { id }: { id: string }, { prisma }: GraphQLContext) => {
        const deletedPost = await prisma.post.delete({
          where: { id },
          select: { id: true },
        });
        return deletedPost.id;
      },
    },


  },
});
