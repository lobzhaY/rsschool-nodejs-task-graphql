import { GraphQLFloat, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

export interface UserInputDto {
  name: string;
  balance: number;
}

export const CreateUserInputGQL = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const ChangeUserInputGQL = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
