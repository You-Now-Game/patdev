import { PrismaClient, StageType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "password123";

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const builder = await prisma.user.upsert({
    where: { email: "ivan@patinastudio.ru" },
    update: {},
    create: {
      name: "Иван Петров",
      email: "ivan@patinastudio.ru",
      role: "BUILDER",
      passwordHash,
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "anna@mail.ru" },
    update: {},
    create: {
      name: "Анна Смирнова",
      email: "anna@mail.ru",
      role: "CLIENT",
      passwordHash,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@patinastudio.ru" },
    update: {},
    create: {
      name: "Администратор",
      email: "admin@patinastudio.ru",
      role: "ADMIN",
      passwordHash,
    },
  });

  const flatProgress: { stage: StageType; percent: number }[] = [
    { stage: "DESIGN", percent: 100 },
    { stage: "ROUGH", percent: 80 },
    { stage: "TECHNICAL", percent: 55 },
    { stage: "WORKING", percent: 30 },
    { stage: "FINISHING", percent: 0 },
  ];

  const flat = await prisma.constructionObject.upsert({
    where: { id: "seed-flat-lenina-12" },
    update: {},
    create: {
      id: "seed-flat-lenina-12",
      type: "APARTMENT",
      address: "ул. Ленина 12, кв. 45",
      area: 68,
      rooms: 2,
      status: "IN_PROGRESS",
      startDate: new Date("2026-09-01"),
      builderId: builder.id,
      clientId: client.id,
      progress: { create: flatProgress },
      visits: {
        create: [
          {
            date: new Date("2026-09-05"),
            timeFrom: "09:00",
            timeTo: "18:00",
            stage: "ROUGH",
            description: "Демонтаж старого покрытия пола",
            progressAfter: 40,
          },
          {
            date: new Date("2026-09-08"),
            timeFrom: "10:00",
            timeTo: "14:00",
            stage: "DESIGN",
            description: "Обмеры, согласование планировки",
            progressAfter: 80,
          },
          {
            date: new Date("2026-09-12"),
            timeFrom: "09:00",
            timeTo: "15:00",
            stage: "TECHNICAL",
            description: "Разметка точек розеток и выключателей",
            progressAfter: 45,
          },
          {
            date: new Date("2026-09-15"),
            timeFrom: "09:00",
            timeTo: "18:00",
            stage: "ROUGH",
            description: "Демонтаж перегородок, вывоз мусора",
            progressAfter: 65,
          },
          {
            date: new Date("2026-09-18"),
            timeFrom: "11:00",
            timeTo: "13:00",
            stage: "DESIGN",
            description: "Дизайн-макет утверждён с клиентом",
            progressAfter: 100,
          },
          {
            date: new Date("2026-09-21"),
            timeFrom: "10:00",
            timeTo: "16:00",
            stage: "ROUGH",
            description: "Стяжка пола в коридоре",
            progressAfter: 80,
          },
          {
            date: new Date("2026-09-24"),
            timeFrom: "09:00",
            timeTo: "17:30",
            stage: "TECHNICAL",
            description: "Разводка электрики в двух комнатах",
            progressAfter: 55,
          },
        ],
      },
      materials: {
        create: [
          { stage: "ROUGH", name: "Цемент М500", unit: "меш.", remaining: 12 },
          { stage: "ROUGH", name: "Пескобетон М300", unit: "меш.", remaining: 0 },
          { stage: "ROUGH", name: "Грунтовка глубокая", unit: "л", remaining: 0 },
          { stage: "TECHNICAL", name: "Кабель ВВГ 3×2,5", unit: "м", remaining: 150 },
          { stage: "TECHNICAL", name: "Кабель ВВГ 3×1,5", unit: "м", remaining: 0 },
          { stage: "TECHNICAL", name: "Труба PPR 20 мм", unit: "м", remaining: 0 },
          { stage: "WORKING", name: "Гипсокартон 12,5 мм", unit: "лист", remaining: 0 },
          { stage: "WORKING", name: "Профиль ПП 60×27", unit: "шт", remaining: 0 },
          { stage: "FINISHING", name: "Ламинат 33 класс", unit: "м²", remaining: 0 },
          { stage: "FINISHING", name: "Краска интерьерная", unit: "л", remaining: 0 },
        ],
      },
    },
  });

  await prisma.constructionObject.upsert({
    where: { id: "seed-house-sosnovka-7" },
    update: {},
    create: {
      id: "seed-house-sosnovka-7",
      type: "HOUSE",
      address: "пос. Сосновка, 7",
      area: 140,
      status: "IN_PROGRESS",
      startDate: new Date("2026-09-01"),
      builderId: builder.id,
      progress: {
        create: [
          { stage: "DESIGN", percent: 100 },
          { stage: "ROUGH", percent: 30 },
          { stage: "TECHNICAL", percent: 0 },
          { stage: "WORKING", percent: 0 },
          { stage: "FINISHING", percent: 0 },
        ],
      },
    },
  });

  await prisma.constructionObject.upsert({
    where: { id: "seed-flat-mira-3" },
    update: {},
    create: {
      id: "seed-flat-mira-3",
      type: "APARTMENT",
      address: "ул. Мира 3, кв. 18",
      area: 42,
      status: "DONE",
      startDate: new Date("2026-03-01"),
      builderId: builder.id,
      progress: {
        create: flatProgress.map((p) => ({ stage: p.stage, percent: 100 })),
      },
    },
  });

  await prisma.constructionObject.upsert({
    where: { id: "seed-house-berezka-22" },
    update: {},
    create: {
      id: "seed-house-berezka-22",
      type: "HOUSE",
      address: 'СНТ «Берёзка», 22',
      area: 96,
      status: "DONE",
      startDate: new Date("2026-03-01"),
      builderId: builder.id,
      progress: {
        create: flatProgress.map((p) => ({ stage: p.stage, percent: 100 })),
      },
    },
  });

  console.log("Сид-данные готовы:");
  console.log(`  Администратор: ${admin.email} / ${DEMO_PASSWORD} (вход на /admin/login)`);
  console.log(`  Строитель:     ${builder.email} / ${DEMO_PASSWORD}`);
  console.log(`  Клиент:        ${client.email} / ${DEMO_PASSWORD}`);
  console.log(`  Объект:        ${flat.address}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
