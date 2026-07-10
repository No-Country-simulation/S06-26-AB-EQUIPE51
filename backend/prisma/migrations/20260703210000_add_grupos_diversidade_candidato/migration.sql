ALTER TABLE "public"."candidatos"
ADD COLUMN "gruposDiversidade" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "public"."candidatos"
SET "gruposDiversidade" = ARRAY["grupoDiversidade"]
WHERE "grupoDiversidade" IS NOT NULL
  AND "grupoDiversidade" <> '';

DROP INDEX IF EXISTS "public"."candidatos_grupoDiversidade_idx";

ALTER TABLE "public"."candidatos"
DROP COLUMN "grupoDiversidade";
