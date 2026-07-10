-- CreateTable
CREATE TABLE "public"."logs_auth" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "acao" TEXT NOT NULL,
    "identificador" TEXT,
    "sucesso" BOOLEAN NOT NULL,
    "motivo" TEXT,
    "ipOrigem" TEXT,
    "userAgent" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."logs_acessos_candidatos" (
    "id" TEXT NOT NULL,
    "candidatoId" TEXT NOT NULL,
    "usuarioResponsavel" TEXT NOT NULL,
    "finalidade" TEXT NOT NULL,
    "ipOrigem" TEXT,
    "userAgent" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_acessos_candidatos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "logs_auth_usuarioId_idx" ON "public"."logs_auth"("usuarioId");

-- CreateIndex
CREATE INDEX "logs_acessos_candidatos_candidatoId_idx" ON "public"."logs_acessos_candidatos"("candidatoId");

-- AddForeignKey
ALTER TABLE "public"."logs_auth" ADD CONSTRAINT "logs_auth_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."logs_acessos_candidatos" ADD CONSTRAINT "logs_acessos_candidatos_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "public"."candidatos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
