import { GraphQLObjectType, GraphQLString } from 'graphql';

export const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => {
        return 'Hello world!';
      },
    },
  },
});
