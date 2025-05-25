import { PrismaClient, User } from "@prisma/client";

export const getUserSubscribedToLoader = (prisma: PrismaClient) => async (userIds: readonly string[]) =>  {
    const userSubscribed = await prisma.user.findMany({
      where: { id: { in: [...userIds] } },
      include: { userSubscribedTo: { select: { author: true } } },
    });

    const authorsMap = new Map<string, User[]>();

    userSubscribed.forEach((user) => {
      const authors = user.userSubscribedTo.map(({ author }) => author);
      authorsMap.set(user.id, authors);
    });

    return userIds.map((id) => authorsMap.get(id) || []);
};

export const getSubscribedToUserLoader = (prisma: PrismaClient) => async (userIds: readonly string[]) => {
     const userWithSubscribers = await prisma.user.findMany({
      where: { id: { in: [...userIds] } },
      include: { subscribedToUser: { select: { subscriber: true } } },
    });

    const subscribersMap = new Map<string, User[]>();

    userWithSubscribers.forEach((user) => {
      const subscribers = user.subscribedToUser.map(({ subscriber }) => subscriber);
      subscribersMap.set(user.id, subscribers);
    });

    return userIds.map((id) => subscribersMap.get(id) || []);
}; 
