"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { saveObjectPhoto, UploadError } from "@/lib/storage";
import { STAGE_ORDER } from "@/lib/stages";
import type { ObjectType } from "@prisma/client";

async function requireBuilder() {
  const session = await auth();
  if (!session?.user || session.user.role !== "BUILDER") throw new Error("Не авторизован");
  return session.user;
}

export async function createObjectAction(formData: FormData) {
  const builder = await requireBuilder();

  const type = String(formData.get("type") ?? "APARTMENT") as ObjectType;
  const address = String(formData.get("address") ?? "").trim();
  const area = Number(formData.get("area") ?? 0);
  const rooms = formData.get("rooms") ? Number(formData.get("rooms")) : null;
  const startDate = String(formData.get("startDate") ?? "");
  const clientLogin = String(formData.get("clientLogin") ?? "").trim();

  if (!address || !area || !startDate) {
    redirect(`/builder/objects?error=${encodeURIComponent("Заполните адрес, площадь и дату начала")}`);
  }

  let clientId: string | undefined;
  if (clientLogin) {
    const client = await prisma.user.findFirst({
      where: {
        role: "CLIENT",
        OR: [{ email: clientLogin }, { phone: clientLogin }],
      },
    });
    if (!client) {
      redirect(
        `/builder/objects?error=${encodeURIComponent(
          "Клиент с такой почтой/телефоном не найден — попросите его сначала зарегистрироваться"
        )}`
      );
    }
    clientId = client!.id;
  }

  const object = await prisma.constructionObject.create({
    data: {
      type,
      address,
      area,
      rooms,
      startDate: new Date(startDate),
      builderId: builder.id,
      clientId,
      progress: {
        create: STAGE_ORDER.map((stage) => ({ stage, percent: 0 })),
      },
    },
  });

  revalidatePath("/builder/objects");
  redirect(`/builder/objects/${object.id}/works`);
}

export async function uploadPhotoAction(objectId: string, formData: FormData) {
  const builder = await requireBuilder();
  const file = formData.get("photo") as File | null;
  if (!file || file.size === 0) return;

  const object = await prisma.constructionObject.findFirst({
    where: { id: objectId, builderId: builder.id },
  });
  if (!object) throw new Error("Объект не найден");

  try {
    const url = await saveObjectPhoto(file);
    await prisma.constructionObject.update({ where: { id: objectId }, data: { photoUrl: url } });
  } catch (error) {
    if (error instanceof UploadError) {
      redirect(`/builder/objects?error=${encodeURIComponent(error.message)}`);
    }
    throw error;
  }

  revalidatePath("/builder/objects");
  revalidatePath(`/client/object`);
}
