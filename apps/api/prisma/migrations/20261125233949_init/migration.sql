-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('SOFTWARE', 'WEB', 'MARKETING', 'SYSTEMS');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'WON', 'LOST');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "service" "ServiceType" NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "contact" VARCHAR(120),
    "title" VARCHAR(120) NOT NULL,
    "description" TEXT NOT NULL,
    "budget" VARCHAR(40),
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leads_created_at_idx" ON "leads"("created_at");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");
