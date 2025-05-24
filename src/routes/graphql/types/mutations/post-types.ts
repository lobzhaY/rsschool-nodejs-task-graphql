import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { UUIDType } from '../uuid.js';

export interface CreatePostInputDto {
  title: string;
  content: string;
  authorId: string;
};

export const CreatePostInputGQL = new GraphQLInputObjectType({
  name: 'CreatePostInputGQL',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});

export interface ChangePostInputDto {
  title: string;
  content: string;
}

export const ChangePostInputGQL = new GraphQLInputObjectType({
  name: 'ChangePostInputGQL',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});
