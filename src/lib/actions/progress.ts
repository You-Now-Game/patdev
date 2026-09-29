"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { STAGE_ORDER } from "@/lib/stages";
import { clamp } from "@/lib/utils";

export async function updateProgressAction(objectId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "BUILDER") throw new Error("Не авторизован");

  const object = await prisma.constructionObject.findFirst({
    where: { id: objectId, builderId: session.user.id },
  });
  if (!object) throw new Error("Объект не найден");

  await Promise.all(
    STAGE_ORDER.map((stage) => {
      const raw = formData.get(`percent_${stage}`);
      const percent = clamp(Math.round(Number(raw ?? 0)), 0, 100);
      return prisma.workProgress.upsert({
        where: { objectId_stage: { objectId, stage } },
        create: { objectId, stage, percent },
        update: { percent },
      });
    })
  );

  revalidatePath(`/builder/objects/${objectId}/works`);
  revalidatePath(`/builder/objects`);
  revalidatePath(`/client/works`);
  revalidatePath(`/client/object`);
}
