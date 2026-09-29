import { prisma } from "@/lib/db";

export function getClientObjectsList(clientId: string) {
  return prisma.constructionObject.findMany({
    where: { clientId },
    orderBy: { createdAt: "asc" },
    select: { id: true, type: true, address: true, status: true },
  });
}

export async function getClientObjectDetail(clientId: string, objectId?: string) {
  const objects = await getClientObjectsList(clientId);
  if (objects.length === 0) return { objects, object: null };

  const targetId = objectId && objects.some((o) => o.id === objectId) ? objectId : objects[0].id;

  const object = await prisma.constructionObject.findFirst({
    where: { id: targetId, clientId },
    include: {
      builder: { select: { name: true } },
      progress: true,
      visits: { orderBy: { date: "desc" } },
      materials: { orderBy: { createdAt: "asc" } },
    },
  });

  return { objects, object };
}

export function getBuilderObjectsList(builderId: string) {
  return prisma.constructionObject.findMany({
    where: { builderId },
    orderBy: { createdAt: "desc" },
    include: { client: { select: { name: true, email: true } }, progress: true },
  });
}

export async function getBuilderObjectDetail(builderId: string, objectId: string) {
  return prisma.constructionObject.findFirst({
    where: { id: objectId, builderId },
    include: {
      client: { select: { name: true, email: true } },
      progress: true,
      visits: { orderBy: { date: "desc" } },
      materials: { orderBy: { createdAt: "asc" } },
    },
  });
}
