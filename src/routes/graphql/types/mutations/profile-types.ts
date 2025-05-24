import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';
import { UUIDType } from '../uuid.js';
import { MemberTypeIdEnum } from '../query/member-types.js';

export interface ProfileInputDto {
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
}

export const CreateProfileInputGQL = new GraphQLInputObjectType({
  name: 'CreateProfileInputGQL',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
  },
});

export const ChangeProfileInputGQL = new GraphQLInputObjectType({
  name: 'ChangeProfileInputGQL',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
  },
});
