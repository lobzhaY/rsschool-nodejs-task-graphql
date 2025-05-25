import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { getMemberLoaderData } from "./loader-utils/member-loader.js";
import { getUserLoaderData } from "./loader-utils/user-loader.js";
import { getSubscribedToUserLoader, getUserSubscribedToLoader } from "./loader-utils/subscribe-loader.js";
import { getProfileByUserIdLoader, getProfileLoader } from "./loader-utils/profile-loader.js";
import { getPosteByAuthorIdLoader, getPostLoader } from "./loader-utils/post-loader.js";

export const createLoaders = (prisma: PrismaClient) => ({
    memberLoader: new DataLoader(getMemberLoaderData(prisma)),
    usersLoader: new DataLoader(getUserLoaderData(prisma)),
    userSubscribedToLoader: getUserSubscribedToLoader(prisma),
    subscribedToUserLoader: getSubscribedToUserLoader(prisma),
    profileLoader: new DataLoader(getProfileLoader(prisma)),
    profileByUserIdLoader: new DataLoader(getProfileByUserIdLoader(prisma)),
    postLoader: new DataLoader(getPostLoader(prisma)),
    postLoaderByAuthorIdLoader: new DataLoader(getPosteByAuthorIdLoader(prisma)),
}); 
