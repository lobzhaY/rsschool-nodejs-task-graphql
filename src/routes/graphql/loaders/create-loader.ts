import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { getMemberLoaderData } from "./loader-utils/member-loader.js";
import { getUserLoaderData } from "./loader-utils/user-loader.js";
import { getSubscribedToUserLoader, getUserSubscribedToLoader } from "./loader-utils/subscribe-loader.js";

export const createLoaders = (prisma: PrismaClient) => ({
    memberLoader: new DataLoader(getMemberLoaderData(prisma)),
    usersLoader: new DataLoader(getUserLoaderData(prisma)),
    userSubscribedToLoader: getUserSubscribedToLoader(prisma),
    subscribedToUserLoader: getSubscribedToUserLoader(prisma),
  }); 
