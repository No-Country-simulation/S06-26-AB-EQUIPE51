import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';

type CsvRow = Record<string, string>;

type ClusterMobilidade = {
  cluster: string;
  municipio: string;
  latitude: number | null;
  longitude: number | null;
  mobilityPatternPredominante: string;
  scoreMobilidade: number;
};

const totalRegistros = Number(process.argv[2] || 100);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data', 'cdrview');
const processadosDir = path.join(dataDir, 'processados');
const assinantesPath = path.join(dataDir, 'assinantes.csv');
const clustersPath = path.join(processadosDir, 'clusters_mobilidade.json');
const outputPath = path.join(
  processadosDir,
  `candidatos_mobilidade_${totalRegistros}.json`,
);

const skillsPorIndice = [
  ['NestJS', 'Prisma', 'PostgreSQL'],
  ['React', 'TypeScript', 'CSS'],
  ['Python', 'SQL', 'Power BI'],
  ['AWS', 'Docker', 'Kubernetes'],
  ['Flutter', 'Dart', 'Firebase'],
  ['Figma', 'UX Research', 'Design System'],
  ['Cypress', 'Jest', 'Automacao'],
  ['Node.js', 'Express', 'MongoDB'],
];

const cargosPorIndice = [
  'BACKEND_DEVELOPER',
  'FRONTEND_DEVELOPER',
  'DATA_ANALYST',
  'DEVOPS_ENGINEER',
  'MOBILE_DEVELOPER',
  'UX_DESIGNER',
  'QA_ENGINEER',
  'BACKEND_DEVELOPER',
];

const niveis = ['JUNIOR', 'PLENO', 'SENIOR'];
const gruposDiversidadePorIndice: string[][] = [
  ['MULHER'],
  ['PCD'],
  ['NEGRO'],
  ['LGBTQIA+'],
  ['INDIGENA'],
  ['GENERO'],
  ['RACA/ETNIA'],
  ['GERACIONAL'],
  ['INCLUSAO SOCIOECONOMICA'],
  ['INCLUSAO HUMANITARIA'],
  ['MULHER', 'PCD'],
  ['NEGRO', 'LGBTQIA+'],
  ['INDIGENA', 'INCLUSAO HUMANITARIA'],
  [],
];

const primeirosNomes = [
  'Rafael',
  'Camila',
  'Lucas',
  'Mariana',
  'Pedro',
  'Fernanda',
  'Bruno',
  'Aline',
  'Diego',
  'Juliana',
  'Gabriel',
  'Patricia',
  'Thiago',
  'Renata',
  'Felipe',
  'Larissa',
  'Joao',
  'Bianca',
  'Andre',
  'Natalia',
  'Eduardo',
  'Priscila',
  'Caio',
  'Isabela',
  'Gustavo',
  'Carolina',
  'Rodrigo',
  'Vanessa',
  'Marcelo',
  'Tatiane',
  'Leandro',
  'Sabrina',
  'Daniel',
  'Monica',
  'Vitor',
  'Helena',
  'Samuel',
  'Leticia',
  'Igor',
  'Raquel',
];

const sobrenomes = [
  'Martins',
  'Oliveira',
  'Menezes',
  'Silva',
  'Almeida',
  'Rocha',
  'Santos',
  'Costa',
  'Pereira',
  'Ferreira',
  'Nascimento',
  'Alves',
  'Campos',
  'Rodrigues',
  'Freitas',
  'Souza',
  'Ramos',
  'Vieira',
  'Barbosa',
  'Lima',
  'Moreira',
  'Cardoso',
  'Teixeira',
  'Gomes',
  'Araujo',
  'Monteiro',
  'Correia',
  'Dias',
  'Castro',
  'Nunes',
];

function nomeCandidato(index: number) {
  const primeiroNome = primeirosNomes[index % primeirosNomes.length];
  const sobrenome = sobrenomes[(index * 7) % sobrenomes.length];

  return `${primeiroNome} ${sobrenome}`;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === ',' && !insideQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);

  return values;
}

async function readFirstRows(
  filePath: string,
  limit: number,
  predicate?: (row: CsvRow) => boolean,
) {
  const rows: CsvRow[] = [];
  const stream = fs.createReadStream(filePath, {
    encoding: 'utf8',
  });
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let headers: string[] | null = null;

  for await (const line of rl) {
    if (!line.trim()) {
      continue;
    }

    if (!headers) {
      headers = parseCsvLine(line).map((header) => header.trim());
      continue;
    }

    const values = parseCsvLine(line);
    const row: CsvRow = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? '';
    });

    if (predicate && !predicate(row)) {
      continue;
    }

    rows.push(row);

    if (rows.length >= limit) {
      rl.close();
      break;
    }
  }

  return rows;
}

function normalizarRegiao(valor: string) {
  return valor
    .replace('FlorianÃ³polis', 'Florianopolis')
    .replace('SÃ£o JosÃ©', 'Sao Jose')
    .replace('PalhoÃ§a', 'Palhoca')
    .replace('BiguaÃ§u', 'Biguacu')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function isFlorianopolis(valor: string) {
  return normalizarRegiao(valor).toUpperCase() === 'FLORIANOPOLIS';
}

function scoreIndividual(mobilityPattern: string, scoreCluster: number) {
  const ajustePorPerfil: Record<string, number> = {
    INTENSA: 8,
    MODERADA: 0,
    BAIXA: -10,
  };

  const score = scoreCluster + (ajustePorPerfil[mobilityPattern] ?? 0);

  return Math.max(0, Math.min(100, Math.round(score)));
}

async function main() {
  if (!fs.existsSync(clustersPath)) {
    throw new Error(
      'Execute npm run mobilidade:processar antes de gerar a amostra.',
    );
  }

  const clusters = JSON.parse(
    fs.readFileSync(clustersPath, 'utf8'),
  ) as ClusterMobilidade[];
  const clusterPorNome = new Map(
    clusters.map((cluster) => [cluster.cluster, cluster]),
  );
  const assinantes = await readFirstRows(
    assinantesPath,
    totalRegistros,
    (assinante) => isFlorianopolis(assinante.home_municipio),
  );

  const candidatos = assinantes.map((assinante, index) => {
    const cluster = clusterPorNome.get(assinante.home_cluster);
    const numero = String(index + 1).padStart(3, '0');
    const mobilityPattern =
      assinante.mobility_pattern ||
      cluster?.mobilityPatternPredominante ||
      'MODERADA';

    return {
      nome: nomeCandidato(index),
      email: `candidato.cdr.${numero}@appbit.local`,
      senha: '123456',
      skills: skillsPorIndice[index % skillsPorIndice.length],
      nivel: niveis[index % niveis.length],
      cargoDesejado: cargosPorIndice[index % cargosPorIndice.length],
      regiao: normalizarRegiao(
        assinante.home_municipio || cluster?.municipio || 'Florianopolis',
      ),
      gruposDiversidade:
        gruposDiversidadePorIndice[
          index % gruposDiversidadePorIndice.length
        ],
      latitude: cluster?.latitude ?? null,
      longitude: cluster?.longitude ?? null,
      ageGroup: assinante.age_group,
      incomeCluster: assinante.income_cluster,
      mobilityPattern,
      scoreMobilidade: scoreIndividual(
        mobilityPattern,
        cluster?.scoreMobilidade ?? 70,
      ),
      origemMobilidade: {
        assinanteHash: Number(assinante.assinante_hash),
        homeCluster: assinante.home_cluster,
        homeMunicipio: normalizarRegiao(assinante.home_municipio),
      },
    };
  });

  fs.writeFileSync(outputPath, `${JSON.stringify(candidatos, null, 2)}\n`);

  console.log(`Amostra gerada com ${candidatos.length} registros.`);
  console.log(path.relative(rootDir, outputPath));
}

main().catch((error) => {
  console.error('Erro ao gerar amostra:', error);
  process.exit(1);
});
