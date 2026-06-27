/*
  Warnings:

  - A unique constraint covering the columns `[nomeEmpresa]` on the table `empresas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "empresas_nomeEmpresa_key" ON "public"."empresas"("nomeEmpresa");
