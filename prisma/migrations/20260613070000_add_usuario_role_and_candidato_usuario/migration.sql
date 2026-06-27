-- CreateEnum
CREATE TYPE "public"."UsuarioRole" AS ENUM ('EMPRESA', 'CANDIDATO', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."usuarios" ADD COLUMN "role" "public"."UsuarioRole" NOT NULL DEFAULT 'EMPRESA';

-- AlterTable
ALTER TABLE "public"."candidatos" ADD COLUMN "usuarioId" TEXT;

-- Backfill users for existing candidates before removing duplicated identity columns.
INSERT INTO "public"."usuarios" ("id", "nome", "email", "senha", "role", "ativo", "criadoEm", "atualizadoEm")
SELECT 'migrated-candidato-' || c."id",
       c."nome",
       c."email",
       'SENHA_MIGRACAO_DEFINIR_RESET',
       'CANDIDATO',
       c."ativo",
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
FROM "public"."candidatos" c
WHERE NOT EXISTS (
    SELECT 1
    FROM "public"."usuarios" u
    WHERE u."email" = c."email"
);

UPDATE "public"."candidatos" c
SET "usuarioId" = u."id"
FROM "public"."usuarios" u
WHERE u."email" = c."email";

-- AlterTable
ALTER TABLE "public"."candidatos" ALTER COLUMN "usuarioId" SET NOT NULL;
ALTER TABLE "public"."candidatos" DROP COLUMN "nome";
ALTER TABLE "public"."candidatos" DROP COLUMN "email";

-- CreateIndex
CREATE UNIQUE INDEX "candidatos_usuarioId_key" ON "public"."candidatos"("usuarioId");

-- AddForeignKey
ALTER TABLE "public"."candidatos" ADD CONSTRAINT "candidatos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
