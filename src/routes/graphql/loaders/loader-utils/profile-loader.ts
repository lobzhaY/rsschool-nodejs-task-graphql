import { PrismaClient } from "@prisma/client";

export const getProfileLoader = (prisma: PrismaClient) =>  async (profileIds: readonly string[]) => {
     const profiles = await prisma.profile.findMany({
      where: { id: { in: [...profileIds] } },
    });

    return profileIds.map((id) => profiles.find((profile) => profile.id === id));
};

export const getProfileByUserIdLoader = (prisma: PrismaClient) => async (userIds: readonly string[]) => {
     const profiles = await prisma.profile.findMany({
      where: { userId: { in: [...userIds] } },
    });

    return userIds.map((id) => profiles.find((profile) => profile.userId === id));
};
