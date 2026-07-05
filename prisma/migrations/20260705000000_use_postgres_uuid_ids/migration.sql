CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TEMP TABLE "__uuid_usuarios" AS
SELECT "id" AS "old_id", gen_random_uuid() AS "new_id"
FROM "usuarios";

CREATE TEMP TABLE "__uuid_empresas" AS
SELECT "id" AS "old_id", gen_random_uuid() AS "new_id"
FROM "empresas";

CREATE TEMP TABLE "__uuid_vagas" AS
SELECT "id" AS "old_id", gen_random_uuid() AS "new_id"
FROM "vagas";

CREATE TEMP TABLE "__uuid_candidatos" AS
SELECT "id" AS "old_id", gen_random_uuid() AS "new_id"
FROM "candidatos";

CREATE TEMP TABLE "__uuid_logs_auth" AS
SELECT "id" AS "old_id", gen_random_uuid() AS "new_id"
FROM "logs_auth";

CREATE TEMP TABLE "__uuid_refresh_tokens" AS
SELECT "id" AS "old_id", gen_random_uuid() AS "new_id"
FROM "refresh_tokens";

CREATE TEMP TABLE "__uuid_logs_acessos_candidatos" AS
SELECT "id" AS "old_id", gen_random_uuid() AS "new_id"
FROM "logs_acessos_candidatos";

CREATE TEMP TABLE "__uuid_logs_candidatos" AS
SELECT "id" AS "old_id", gen_random_uuid() AS "new_id"
FROM "logs_candidatos";

CREATE TEMP TABLE "__uuid_logs_empresas" AS
SELECT "id" AS "old_id", gen_random_uuid() AS "new_id"
FROM "logs_empresas";

CREATE TEMP TABLE "__uuid_logs_vagas" AS
SELECT "id" AS "old_id", gen_random_uuid() AS "new_id"
FROM "logs_vagas";

ALTER TABLE "usuarios" ADD COLUMN "id_uuid" uuid;
ALTER TABLE "empresas" ADD COLUMN "id_uuid" uuid, ADD COLUMN "usuarioId_uuid" uuid;
ALTER TABLE "vagas" ADD COLUMN "id_uuid" uuid, ADD COLUMN "empresaId_uuid" uuid;
ALTER TABLE "candidatos" ADD COLUMN "id_uuid" uuid, ADD COLUMN "usuarioId_uuid" uuid;
ALTER TABLE "logs_auth" ADD COLUMN "id_uuid" uuid, ADD COLUMN "usuarioId_uuid" uuid;
ALTER TABLE "refresh_tokens" ADD COLUMN "id_uuid" uuid, ADD COLUMN "usuarioId_uuid" uuid;
ALTER TABLE "logs_acessos_candidatos" ADD COLUMN "id_uuid" uuid, ADD COLUMN "candidatoId_uuid" uuid;
ALTER TABLE "logs_candidatos" ADD COLUMN "id_uuid" uuid, ADD COLUMN "candidatoId_uuid" uuid;
ALTER TABLE "logs_empresas" ADD COLUMN "id_uuid" uuid, ADD COLUMN "empresaId_uuid" uuid;
ALTER TABLE "logs_vagas" ADD COLUMN "id_uuid" uuid, ADD COLUMN "vagaId_uuid" uuid;

UPDATE "usuarios" t
SET "id_uuid" = m."new_id"
FROM "__uuid_usuarios" m
WHERE t."id" = m."old_id";

UPDATE "empresas" t
SET
  "id_uuid" = e."new_id",
  "usuarioId_uuid" = u."new_id"
FROM "__uuid_empresas" e, "__uuid_usuarios" u
WHERE t."id" = e."old_id"
  AND t."usuarioId" = u."old_id";

UPDATE "vagas" t
SET
  "id_uuid" = v."new_id",
  "empresaId_uuid" = e."new_id"
FROM "__uuid_vagas" v, "__uuid_empresas" e
WHERE t."id" = v."old_id"
  AND t."empresaId" = e."old_id";

UPDATE "candidatos" t
SET
  "id_uuid" = c."new_id",
  "usuarioId_uuid" = u."new_id"
FROM "__uuid_candidatos" c, "__uuid_usuarios" u
WHERE t."id" = c."old_id"
  AND t."usuarioId" = u."old_id";

UPDATE "logs_auth" t
SET "id_uuid" = l."new_id"
FROM "__uuid_logs_auth" l
WHERE t."id" = l."old_id"
;

UPDATE "logs_auth" t
SET "usuarioId_uuid" = u."new_id"
FROM "__uuid_usuarios" u
WHERE t."usuarioId" = u."old_id";

UPDATE "refresh_tokens" t
SET
  "id_uuid" = r."new_id",
  "usuarioId_uuid" = u."new_id"
FROM "__uuid_refresh_tokens" r, "__uuid_usuarios" u
WHERE t."id" = r."old_id"
  AND t."usuarioId" = u."old_id";

UPDATE "logs_acessos_candidatos" t
SET
  "id_uuid" = l."new_id",
  "candidatoId_uuid" = c."new_id"
FROM "__uuid_logs_acessos_candidatos" l, "__uuid_candidatos" c
WHERE t."id" = l."old_id"
  AND t."candidatoId" = c."old_id";

UPDATE "logs_candidatos" t
SET
  "id_uuid" = l."new_id",
  "candidatoId_uuid" = c."new_id"
FROM "__uuid_logs_candidatos" l, "__uuid_candidatos" c
WHERE t."id" = l."old_id"
  AND t."candidatoId" = c."old_id";

UPDATE "logs_empresas" t
SET
  "id_uuid" = l."new_id",
  "empresaId_uuid" = e."new_id"
FROM "__uuid_logs_empresas" l, "__uuid_empresas" e
WHERE t."id" = l."old_id"
  AND t."empresaId" = e."old_id";

UPDATE "logs_vagas" t
SET
  "id_uuid" = l."new_id",
  "vagaId_uuid" = v."new_id"
FROM "__uuid_logs_vagas" l, "__uuid_vagas" v
WHERE t."id" = l."old_id"
  AND t."vagaId" = v."old_id";

DO $$
DECLARE
  constraint_record record;
BEGIN
  FOR constraint_record IN
    SELECT conrelid::regclass AS table_name, conname
    FROM pg_constraint
    WHERE contype = 'f'
      AND connamespace = 'public'::regnamespace
  LOOP
    EXECUTE format(
      'ALTER TABLE %s DROP CONSTRAINT %I',
      constraint_record.table_name,
      constraint_record.conname
    );
  END LOOP;
END $$;

ALTER TABLE "usuarios" DROP CONSTRAINT IF EXISTS "usuarios_pkey";
ALTER TABLE "empresas" DROP CONSTRAINT IF EXISTS "empresas_pkey";
ALTER TABLE "vagas" DROP CONSTRAINT IF EXISTS "vagas_pkey";
ALTER TABLE "candidatos" DROP CONSTRAINT IF EXISTS "candidatos_pkey";
ALTER TABLE "logs_auth" DROP CONSTRAINT IF EXISTS "logs_auth_pkey";
ALTER TABLE "refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_pkey";
ALTER TABLE "logs_acessos_candidatos" DROP CONSTRAINT IF EXISTS "logs_acessos_candidatos_pkey";
ALTER TABLE "logs_candidatos" DROP CONSTRAINT IF EXISTS "logs_candidatos_pkey";
ALTER TABLE "logs_empresas" DROP CONSTRAINT IF EXISTS "logs_empresas_pkey";
ALTER TABLE "logs_vagas" DROP CONSTRAINT IF EXISTS "logs_vagas_pkey";

DROP INDEX IF EXISTS "empresas_usuarioId_key";
DROP INDEX IF EXISTS "candidatos_usuarioId_key";
DROP INDEX IF EXISTS "logs_auth_usuarioId_idx";
DROP INDEX IF EXISTS "refresh_tokens_usuarioId_idx";
DROP INDEX IF EXISTS "vagas_empresaId_idx";
DROP INDEX IF EXISTS "logs_acessos_candidatos_candidatoId_idx";
DROP INDEX IF EXISTS "logs_candidatos_candidatoId_idx";
DROP INDEX IF EXISTS "logs_empresas_empresaId_idx";
DROP INDEX IF EXISTS "logs_vagas_vagaId_idx";

ALTER TABLE "usuarios" DROP COLUMN "id";
ALTER TABLE "usuarios" RENAME COLUMN "id_uuid" TO "id";
ALTER TABLE "usuarios" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "usuarios" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id");

ALTER TABLE "empresas" DROP COLUMN "id", DROP COLUMN "usuarioId";
ALTER TABLE "empresas" RENAME COLUMN "id_uuid" TO "id";
ALTER TABLE "empresas" RENAME COLUMN "usuarioId_uuid" TO "usuarioId";
ALTER TABLE "empresas" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "empresas" ALTER COLUMN "usuarioId" SET NOT NULL;
ALTER TABLE "empresas" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX "empresas_usuarioId_key" ON "empresas"("usuarioId");

ALTER TABLE "vagas" DROP COLUMN "id", DROP COLUMN "empresaId";
ALTER TABLE "vagas" RENAME COLUMN "id_uuid" TO "id";
ALTER TABLE "vagas" RENAME COLUMN "empresaId_uuid" TO "empresaId";
ALTER TABLE "vagas" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "vagas" ALTER COLUMN "empresaId" SET NOT NULL;
ALTER TABLE "vagas" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "vagas" ADD CONSTRAINT "vagas_pkey" PRIMARY KEY ("id");
CREATE INDEX "vagas_empresaId_idx" ON "vagas"("empresaId");

ALTER TABLE "candidatos" DROP COLUMN "id", DROP COLUMN "usuarioId";
ALTER TABLE "candidatos" RENAME COLUMN "id_uuid" TO "id";
ALTER TABLE "candidatos" RENAME COLUMN "usuarioId_uuid" TO "usuarioId";
ALTER TABLE "candidatos" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "candidatos" ALTER COLUMN "usuarioId" SET NOT NULL;
ALTER TABLE "candidatos" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "candidatos" ADD CONSTRAINT "candidatos_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX "candidatos_usuarioId_key" ON "candidatos"("usuarioId");

ALTER TABLE "logs_auth" DROP COLUMN "id", DROP COLUMN "usuarioId";
ALTER TABLE "logs_auth" RENAME COLUMN "id_uuid" TO "id";
ALTER TABLE "logs_auth" RENAME COLUMN "usuarioId_uuid" TO "usuarioId";
ALTER TABLE "logs_auth" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "logs_auth" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "logs_auth" ADD CONSTRAINT "logs_auth_pkey" PRIMARY KEY ("id");
CREATE INDEX "logs_auth_usuarioId_idx" ON "logs_auth"("usuarioId");

ALTER TABLE "refresh_tokens" DROP COLUMN "id", DROP COLUMN "usuarioId";
ALTER TABLE "refresh_tokens" RENAME COLUMN "id_uuid" TO "id";
ALTER TABLE "refresh_tokens" RENAME COLUMN "usuarioId_uuid" TO "usuarioId";
ALTER TABLE "refresh_tokens" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "refresh_tokens" ALTER COLUMN "usuarioId" SET NOT NULL;
ALTER TABLE "refresh_tokens" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id");
CREATE INDEX "refresh_tokens_usuarioId_idx" ON "refresh_tokens"("usuarioId");

ALTER TABLE "logs_acessos_candidatos" DROP COLUMN "id", DROP COLUMN "candidatoId";
ALTER TABLE "logs_acessos_candidatos" RENAME COLUMN "id_uuid" TO "id";
ALTER TABLE "logs_acessos_candidatos" RENAME COLUMN "candidatoId_uuid" TO "candidatoId";
ALTER TABLE "logs_acessos_candidatos" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "logs_acessos_candidatos" ALTER COLUMN "candidatoId" SET NOT NULL;
ALTER TABLE "logs_acessos_candidatos" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "logs_acessos_candidatos" ADD CONSTRAINT "logs_acessos_candidatos_pkey" PRIMARY KEY ("id");
CREATE INDEX "logs_acessos_candidatos_candidatoId_idx" ON "logs_acessos_candidatos"("candidatoId");

ALTER TABLE "logs_candidatos" DROP COLUMN "id", DROP COLUMN "candidatoId";
ALTER TABLE "logs_candidatos" RENAME COLUMN "id_uuid" TO "id";
ALTER TABLE "logs_candidatos" RENAME COLUMN "candidatoId_uuid" TO "candidatoId";
ALTER TABLE "logs_candidatos" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "logs_candidatos" ALTER COLUMN "candidatoId" SET NOT NULL;
ALTER TABLE "logs_candidatos" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "logs_candidatos" ADD CONSTRAINT "logs_candidatos_pkey" PRIMARY KEY ("id");
CREATE INDEX "logs_candidatos_candidatoId_idx" ON "logs_candidatos"("candidatoId");

ALTER TABLE "logs_empresas" DROP COLUMN "id", DROP COLUMN "empresaId";
ALTER TABLE "logs_empresas" RENAME COLUMN "id_uuid" TO "id";
ALTER TABLE "logs_empresas" RENAME COLUMN "empresaId_uuid" TO "empresaId";
ALTER TABLE "logs_empresas" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "logs_empresas" ALTER COLUMN "empresaId" SET NOT NULL;
ALTER TABLE "logs_empresas" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "logs_empresas" ADD CONSTRAINT "logs_empresas_pkey" PRIMARY KEY ("id");
CREATE INDEX "logs_empresas_empresaId_idx" ON "logs_empresas"("empresaId");

ALTER TABLE "logs_vagas" DROP COLUMN "id", DROP COLUMN "vagaId";
ALTER TABLE "logs_vagas" RENAME COLUMN "id_uuid" TO "id";
ALTER TABLE "logs_vagas" RENAME COLUMN "vagaId_uuid" TO "vagaId";
ALTER TABLE "logs_vagas" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "logs_vagas" ALTER COLUMN "vagaId" SET NOT NULL;
ALTER TABLE "logs_vagas" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "logs_vagas" ADD CONSTRAINT "logs_vagas_pkey" PRIMARY KEY ("id");
CREATE INDEX "logs_vagas_vagaId_idx" ON "logs_vagas"("vagaId");

ALTER TABLE "empresas"
ADD CONSTRAINT "empresas_usuarioId_fkey"
FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "candidatos"
ADD CONSTRAINT "candidatos_usuarioId_fkey"
FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "logs_auth"
ADD CONSTRAINT "logs_auth_usuarioId_fkey"
FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "refresh_tokens"
ADD CONSTRAINT "refresh_tokens_usuarioId_fkey"
FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "vagas"
ADD CONSTRAINT "vagas_empresaId_fkey"
FOREIGN KEY ("empresaId") REFERENCES "empresas"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "logs_empresas"
ADD CONSTRAINT "logs_empresas_empresaId_fkey"
FOREIGN KEY ("empresaId") REFERENCES "empresas"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "logs_vagas"
ADD CONSTRAINT "logs_vagas_vagaId_fkey"
FOREIGN KEY ("vagaId") REFERENCES "vagas"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "logs_acessos_candidatos"
ADD CONSTRAINT "logs_acessos_candidatos_candidatoId_fkey"
FOREIGN KEY ("candidatoId") REFERENCES "candidatos"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "logs_candidatos"
ADD CONSTRAINT "logs_candidatos_candidatoId_fkey"
FOREIGN KEY ("candidatoId") REFERENCES "candidatos"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
