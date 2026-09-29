"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
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

function revalidateMaterialPaths(objectId: string) {
  revalidatePath(`/builder/objects/${objectId}/materials`);
  revalidatePath(`/client/materials`);
}

export async function saveMaterialsAction(objectId: string, stage: StageType, formData: FormData) {
  await requireOwnedObject(objectId);

  const ids = formData.getAll("materialId").map(String);
  await Promise.all(
    ids.map((id) => {
      const name = String(formData.get(`name_${id}`) ?? "").trim();
      const unit = String(formData.get(`unit_${id}`) ?? "шт");
      const remaining = Number(formData.get(`remaining_${id}`) ?? 0);
      if (!name) return null;
      return prisma.material.update({
        where: { id },
        data: { name, unit, remaining: Math.max(0, remaining) },
      });
    })
  );

  revalidateMaterialPaths(objectId);
}

export async function addMaterialAction(objectId: string, stage: StageType, formData: FormData) {
  await requireOwnedObject(objectId);

  const name = String(formData.get("newName") ?? "").trim();
  const unit = String(formData.get("newUnit") ?? "шт");
  if (!name) {
    redirect(
      `/builder/objects/${objectId}/materials?error=${encodeURIComponent("Укажите название материала")}`
    );
  }

  await prisma.material.create({
    data: { objectId, stage, name, unit, remaining: 0 },
  });

  revalidateMaterialPaths(objectId);
}

export async function deleteMaterialAction(objectId: string, materialId: string) {
  await requireOwnedObject(objectId);
  await prisma.material.delete({ where: { id: materialId } });
  revalidateMaterialPaths(objectId);
}
