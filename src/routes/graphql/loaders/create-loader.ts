import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { getMemberLoaderData } from "./loader-utils/member-loader.js";
import { getUserLoaderData } from "./loader-utils/user-loader.js";

export const createLoaders = (prisma: PrismaClient) => ({
    memberLoader: new DataLoader(getMemberLoaderData(prisma)),
    usersLoader: new DataLoader(getUserLoaderData(prisma)),
  }); 
