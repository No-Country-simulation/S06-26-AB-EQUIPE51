/*
  Warnings:

  - Made the column `metaDiversidade` on table `empresas` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."candidatos" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."empresas" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "metaDiversidade" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."usuarios" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."vagas" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;
