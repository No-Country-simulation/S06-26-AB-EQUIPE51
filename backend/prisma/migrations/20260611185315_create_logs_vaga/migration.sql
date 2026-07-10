-- CreateTable
CREATE TABLE "public"."logs_vagas" (
    "id" TEXT NOT NULL,
    "vagaId" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "usuarioResponsavel" TEXT,
    "ipOrigem" TEXT,
    "userAgent" TEXT,
    "dadosAntes" JSONB,
    "dadosDepois" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_vagas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."logs_vagas" ADD CONSTRAINT "logs_vagas_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "public"."vagas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
