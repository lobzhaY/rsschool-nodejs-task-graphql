import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";

export enum MemberTypeNameEnum {
  BASIC = 'BASIC',
  BUSINESS = 'BUSINESS',
}

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeNameEnum.BASIC]: { value: MemberTypeNameEnum.BASIC },
    [MemberTypeNameEnum.BUSINESS]: { value: MemberTypeNameEnum.BUSINESS },
  },
});

export const MemberTypeGQL = new GraphQLObjectType({
  name: 'MemberTypeGQL',
  fields: {
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});