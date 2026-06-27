-- CreateTable
CREATE TABLE "public"."logs_empresas" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dadosAntes" JSONB,
    "dadosDepois" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_empresas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."logs_empresas" ADD CONSTRAINT "logs_empresas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
