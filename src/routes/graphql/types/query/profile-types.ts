import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../uuid.js';
import { MemberTypeGQL, MemberTypeIdEnum } from './member-types.js';
import { Profile } from '@prisma/client';
import { GraphQLContext } from '../../schemas/root-query.js';

export const ProfileGQL = new GraphQLObjectType<Profile, GraphQLContext>({
  name: 'ProfileGQL',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    memberType: {
      type: new GraphQLNonNull(MemberTypeGQL),
      resolve: async (profile: Profile, _args, { loaders }) => {
        return await loaders.memberLoader.load(profile.memberTypeId);
      },
    },
  }),
});
