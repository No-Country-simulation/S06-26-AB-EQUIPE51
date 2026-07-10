CREATE TYPE "ModalidadeVaga" AS ENUM ('PRESENCIAL', 'HIBRIDO', 'REMOTO');

ALTER TABLE "vagas"
ADD COLUMN "cargo" TEXT,
ADD COLUMN "modalidade" "ModalidadeVaga" NOT NULL DEFAULT 'PRESENCIAL';

UPDATE "vagas" SET "cargo" = "titulo" WHERE "cargo" IS NULL;

ALTER TABLE "vagas" ALTER COLUMN "cargo" SET NOT NULL;

ALTER TABLE "candidatos" ADD COLUMN "cargoDesejado" TEXT;
