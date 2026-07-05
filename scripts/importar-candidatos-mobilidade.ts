import 'dotenv/config';

import { Cargo, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'node:fs';
import * as path from 'node:path';

type CandidatoMobilidade = {
  nome: string;
  email: string;
  senha: string;
  skills: string[];
  nivel: string;
  cargoDesejado: Cargo;
  regiao: string;
  grupoDiversidade?: string | null;
  gruposDiversidade?: string[];
  latitude?: number | null;
  longitude?: number | null;
  ageGroup?: string | null;
  incomeCluster?: string | null;
  mobilityPattern?: string | null;
  scoreMobilidade?: number | null;
};

const prisma = new PrismaClient();
const rootDir = path.resolve(__dirname, '..');
const defaultInputPath = path.join(
  rootDir,
  'data',
  'cdrview',
  'processados',
  'candidatos_mobilidade_100.json',
);
const inputPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : defaultInputPath;

function carregarCandidatos() {
  if (!fs.existsSync(inputPath)) {
    throw new Error(
      `Arquivo nao encontrado: ${path.relative(rootDir, inputPath)}`,
    );
  }

  const candidatos = JSON.parse(
    fs.readFileSync(inputPath, 'utf8'),
  ) as CandidatoMobilidade[];

  if (!Array.isArray(candidatos) || candidatos.length === 0) {
    throw new Error('Arquivo de candidatos vazio ou invalido.');
  }

  return candidatos;
}

function dadosCandidato(candidato: CandidatoMobilidade) {
  const gruposDiversidade =
    candidato.gruposDiversidade ??
    (candidato.grupoDiversidade ? [candidato.grupoDiversidade] : []);

  return {
    skills: candidato.skills,
    nivel: candidato.nivel,
    cargoDesejado: candidato.cargoDesejado,
    regiao: candidato.regiao,
    gruposDiversidade,
    latitude: candidato.latitude ?? null,
    longitude: candidato.longitude ?? null,
    ageGroup: candidato.ageGroup ?? null,
    incomeCluster: candidato.incomeCluster ?? null,
    mobilityPattern: candidato.mobilityPattern ?? null,
    scoreMobilidade: candidato.scoreMobilidade ?? 0,
    ativo: true,
  };
}

function validarCargoDesejado(candidato: CandidatoMobilidade) {
  if (!Object.values(Cargo).includes(candidato.cargoDesejado)) {
    throw new Error(
      `Cargo desejado invalido para ${candidato.email}: ${candidato.cargoDesejado}`,
    );
  }
}

async function importarCandidato(
  candidato: CandidatoMobilidade,
  senhaHash: string,
) {
  const usuarioExistente = await prisma.usuario.findUnique({
    where: {
      email: candidato.email,
    },
    include: {
      candidato: true,
    },
  });

  if (!usuarioExistente) {
    await prisma.usuario.create({
      data: {
        nome: candidato.nome,
        email: candidato.email,
        senha: senhaHash,
        role: 'CANDIDATO',
        ativo: true,
        candidato: {
          create: dadosCandidato(candidato),
        },
      },
    });

    return 'criado';
  }

  await prisma.usuario.update({
    where: {
      id: usuarioExistente.id,
    },
    data: {
      nome: candidato.nome,
      senha: senhaHash,
      role: 'CANDIDATO',
      ativo: true,
    },
  });

  if (usuarioExistente.candidato) {
    await prisma.candidato.update({
      where: {
        id: usuarioExistente.candidato.id,
      },
      data: dadosCandidato(candidato),
    });

    return 'atualizado';
  }

  await prisma.candidato.create({
    data: {
      ...dadosCandidato(candidato),
      usuarioId: usuarioExistente.id,
    },
  });

  return 'criado';
}

async function main() {
  const candidatos = carregarCandidatos();
  const senhaHash = await bcrypt.hash('123456', 10);
  let criados = 0;
  let atualizados = 0;

  for (const candidato of candidatos) {
    validarCargoDesejado(candidato);

    const resultado = await importarCandidato(candidato, senhaHash);

    if (resultado === 'criado') {
      criados += 1;
    } else {
      atualizados += 1;
    }
  }

  console.log(
    `Importacao finalizada: ${criados} criados, ${atualizados} atualizados.`,
  );
  console.log(`Arquivo: ${path.relative(rootDir, inputPath)}`);
}

main()
  .catch((error) => {
    console.error('Erro ao importar candidatos de mobilidade:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
