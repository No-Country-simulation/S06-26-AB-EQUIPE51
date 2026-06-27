-- CreateTable
CREATE TABLE "public"."logs_candidatos" (
    "id" TEXT NOT NULL,
    "candidatoId" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "usuarioResponsavel" TEXT,
    "ipOrigem" TEXT,
    "userAgent" TEXT,
    "dadosAntes" JSONB,
    "dadosDepois" JSONB,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_candidatos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "logs_candidatos_candidatoId_idx" ON "public"."logs_candidatos"("candidatoId");

-- AddForeignKey
ALTER TABLE "public"."logs_candidatos" ADD CONSTRAINT "logs_candidatos_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "public"."candidatos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
