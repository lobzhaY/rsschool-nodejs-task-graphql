import { GraphQLFloat, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLType } from "graphql";
import { UUIDType } from "./uuid.js";
import { ProfileGQL } from "./profile-types.js";
import { PostGQL } from "./post-types.js";

const NonNullListOf = <T extends GraphQLType>(type: T) =>
  new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(type)));


export const UserTypeGQL = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
     id: { type: new GraphQLNonNull(UUIDType)},
    name: { type: new GraphQLNonNull(GraphQLString)},
    balance: { type: new GraphQLNonNull(GraphQLFloat)},
    profile: { type: ProfileGQL},
    posts: { type: NonNullListOf(PostGQL)},
    userSubscribedTo: { type: NonNullListOf(UserTypeGQL)},
    subscribedToUser: { type: NonNullListOf(UserTypeGQL)},
  })});