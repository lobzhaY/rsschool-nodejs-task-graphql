import { PrismaClient } from "@prisma/client";
import { MemberTypeId } from "../../../member-types/schemas.js";

export const getMemberLoaderData =
  (prisma: PrismaClient) => async (memberTypeIds: readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: memberTypeIds as MemberTypeId[] } },
    });

    return memberTypeIds.map((id) => memberTypes.find((member) => member.id === id));
  };