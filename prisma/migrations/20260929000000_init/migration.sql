-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'BUILDER');

-- CreateEnum
CREATE TYPE "ObjectType" AS ENUM ('APARTMENT', 'HOUSE');

-- CreateEnum
CREATE TYPE "ObjectStatus" AS ENUM ('IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "StageType" AS ENUM ('DESIGN', 'ROUGH', 'TECHNICAL', 'WORKING', 'FINISHING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConstructionObject" (
    "id" TEXT NOT NULL,
    "type" "ObjectType" NOT NULL,
    "address" TEXT NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "rooms" INTEGER,
    "status" "ObjectStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "photoUrl" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "builderId" TEXT NOT NULL,
    "clientId" TEXT,

    CONSTRAINT "ConstructionObject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkProgress" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "stage" "StageType" NOT NULL,
    "percent" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeFrom" TEXT NOT NULL,
    "timeTo" TEXT NOT NULL,
    "stage" "StageType" NOT NULL,
    "description" TEXT NOT NULL,
    "progressAfter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "stage" "StageType" NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "remaining" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "WorkProgress_objectId_stage_key" ON "WorkProgress"("objectId", "stage");

-- AddForeignKey
ALTER TABLE "ConstructionObject" ADD CONSTRAINT "ConstructionObject_builderId_fkey" FOREIGN KEY ("builderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConstructionObject" ADD CONSTRAINT "ConstructionObject_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkProgress" ADD CONSTRAINT "WorkProgress_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ConstructionObject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ConstructionObject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ConstructionObject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

