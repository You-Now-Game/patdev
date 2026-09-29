"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { clamp } from "@/lib/utils";
import type { StageType } from "@prisma/client";

async function requireOwnedObject(objectId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "BUILDER") throw new Error("Не авторизован");
  const object = await prisma.constructionObject.findFirst({
    where: { id: objectId, builderId: session.user.id },
  });
  if (!object) throw new Error("Объект не найден");
  return object;
}

function revalidateVisitPaths(objectId: string) {
  revalidatePath(`/builder/objects/${objectId}/visits`);
  revalidatePath(`/builder/objects/${objectId}/works`);
  revalidatePath(`/builder/objects`);
  revalidatePath(`/client/visits`);
  revalidatePath(`/client/works`);
  revalidatePath(`/client/object`);
}

export async function addVisitAction(objectId: string, formData: FormData) {
  await requireOwnedObject(objectId);

  const visitId = formData.get("visitId");
  const date = String(formData.get("date") ?? "");
  const timeFrom = String(formData.get("timeFrom") ?? "");
  const timeTo = String(formData.get("timeTo") ?? "");
  const stage = String(formData.get("stage") ?? "") as StageType;
  const description = String(formData.get("description") ?? "").trim();
  const progressAfter = clamp(Math.round(Number(formData.get("progressAfter") ?? 0)), 0, 100);

  if (!date || !timeFrom || !timeTo || !stage || !description) {
    redirect(
      `/builder/objects/${objectId}/visits?error=${encodeURIComponent("Заполните все поля записи")}`
    );
  }

  const data = {
    objectId,
    date: new Date(date),
    timeFrom,
    timeTo,
    stage,
    description,
    progressAfter,
  };

  if (visitId) {
    await prisma.visit.update({ where: { id: String(visitId) }, data });
  } else {
    await prisma.visit.create({ data });
    await prisma.workProgress.upsert({
      where: { objectId_stage: { objectId, stage } },
      create: { objectId, stage, percent: progressAfter },
      update: { percent: progressAfter },
    });
  }

  revalidateVisitPaths(objectId);
}

export async function deleteVisitAction(objectId: string, visitId: string) {
  await requireOwnedObject(objectId);
  await prisma.visit.delete({ where: { id: visitId } });
  revalidateVisitPaths(objectId);
}
