import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { getMemberLoaderData } from "./loader-utils/member-loader.js";

export const createLoaders = (prisma: PrismaClient) => ({
    memberLoader: new DataLoader(getMemberLoaderData(prisma)),
  }); 
