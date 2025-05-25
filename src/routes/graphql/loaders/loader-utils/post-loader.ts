import { Post, PrismaClient } from "@prisma/client";

export const getPostLoader = (prisma: PrismaClient) =>  async (postIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { id: { in: [...postIds] } },
    });

    return postIds.map((id) => posts.find((post) => post.id === id));
};

export const getPosteByAuthorIdLoader = (prisma: PrismaClient) => async (authorIds: readonly string[]) => {
      const posts = await prisma.post.findMany({
      where: { authorId: { in: [...authorIds] } },
    });

    const authorMap = new Map<string, Post[]>();

    posts.forEach((post) => {
      const authorPosts = authorMap.get(post.authorId);

      if (authorPosts) {
        authorPosts.push(post);
      } else {
        authorMap.set(post.authorId, [post]);
      }
    });

    return authorIds.map((id) => authorMap.get(id) || []);
};
