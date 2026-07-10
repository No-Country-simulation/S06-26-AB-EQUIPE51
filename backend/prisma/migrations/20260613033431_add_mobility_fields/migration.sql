-- AlterTable
ALTER TABLE "public"."candidatos" ADD COLUMN     "ageGroup" TEXT,
ADD COLUMN     "incomeCluster" TEXT,
ADD COLUMN     "mobilityPattern" TEXT,
ADD COLUMN     "scoreMobilidade" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."vagas" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "candidatos_regiao_idx" ON "public"."candidatos"("regiao");

-- CreateIndex
CREATE INDEX "candidatos_grupoDiversidade_idx" ON "public"."candidatos"("grupoDiversidade");

-- CreateIndex
CREATE INDEX "logs_empresas_empresaId_idx" ON "public"."logs_empresas"("empresaId");

-- CreateIndex
CREATE INDEX "logs_vagas_vagaId_idx" ON "public"."logs_vagas"("vagaId");

-- CreateIndex
CREATE INDEX "vagas_empresaId_idx" ON "public"."vagas"("empresaId");

-- CreateIndex
CREATE INDEX "vagas_regiao_idx" ON "public"."vagas"("regiao");
