-- CreateEnum
CREATE TYPE "LeadKind" AS ENUM ('REQUEST', 'CALL');

-- CreateEnum
CREATE TYPE "CallMode" AS ENUM ('VIDEO', 'WHATSAPP', 'PHONE');

-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "call_at" TIMESTAMP(3),
ADD COLUMN     "call_mode" "CallMode",
ADD COLUMN     "kind" "LeadKind" NOT NULL DEFAULT 'REQUEST',
ADD COLUMN     "locale" VARCHAR(5) NOT NULL DEFAULT 'es',
ADD COLUMN     "source" VARCHAR(200),
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "leads_kind_idx" ON "leads"("kind");
