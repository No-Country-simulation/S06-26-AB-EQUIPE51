import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';

type CsvRow = Record<string, string>;

type ClusterResumo = {
  cluster: string;
  municipio: string;
  latitude: number | null;
  longitude: number | null;
  totalAssinantes: number;
  ageGroups: Record<string, number>;
  incomeClusters: Record<string, number>;
  mobilityPatterns: Record<string, number>;
  mobilityPatternPredominante: string;
  scoreMobilidade: number;
  fluxoSaidaUsuarios: number;
  fluxoSaidaTransicoes: number;
  fluxoEntradaUsuarios: number;
  fluxoEntradaTransicoes: number;
  distanciaMediaKm: number | null;
  periodoPredominante: string | null;
};

const dataDir = path.resolve(__dirname, '..', 'data', 'cdrview');
const outputDir = path.join(dataDir, 'processados');

const arquivos = {
  antenas: path.join(dataDir, 'antenas_flp.csv'),
  assinantes: path.join(dataDir, 'assinantes.csv'),
  fluxoVias: path.join(dataDir, 'tensor_fluxo_vias.csv'),
  tempoDeslocamento: path.join(dataDir, 'tensor_tempo_deslocamento.csv'),
};

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

async function readCsv(filePath: string, onRow: (row: CsvRow) => void) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo nao encontrado: ${filePath}`);
  }

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

    onRow(row);
  }
}

function increment(target: Record<string, number>, key?: string, value = 1) {
  const normalized = (key || 'NAO_INFORMADO').trim();

  target[normalized] = (target[normalized] || 0) + value;
}

function toNumber(value?: string) {
  const parsed = Number(value || 0);

  return Number.isFinite(parsed) ? parsed : 0;
}

function weightedAverage(
  items: Record<string, number>,
  weights: Record<string, number>,
) {
  let total = 0;
  let weighted = 0;

  Object.entries(items).forEach(([key, count]) => {
    total += count;
    weighted += count * (weights[key] ?? 50);
  });

  return total === 0 ? 0 : weighted / total;
}

function topKey(items: Record<string, number>) {
  return (
    Object.entries(items).sort((a, b) => b[1] - a[1])[0]?.[0] || 'NAO_INFORMADO'
  );
}

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;

  return Math.round(value * factor) / factor;
}

function emptyCluster(cluster: string): ClusterResumo {
  return {
    cluster,
    municipio: '',
    latitude: null,
    longitude: null,
    totalAssinantes: 0,
    ageGroups: {},
    incomeClusters: {},
    mobilityPatterns: {},
    mobilityPatternPredominante: 'NAO_INFORMADO',
    scoreMobilidade: 0,
    fluxoSaidaUsuarios: 0,
    fluxoSaidaTransicoes: 0,
    fluxoEntradaUsuarios: 0,
    fluxoEntradaTransicoes: 0,
    distanciaMediaKm: null,
    periodoPredominante: null,
  };
}

async function main() {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });

  const clusters = new Map<string, ClusterResumo>();
  const periodos: Record<string, Record<string, number>> = {};
  const distancias: Record<
    string,
    { totalDistancia: number; totalObservacoes: number }
  > = {};

  const getCluster = (cluster: string) => {
    const normalized = cluster || 'NAO_INFORMADO';

    if (!clusters.has(normalized)) {
      clusters.set(normalized, emptyCluster(normalized));
    }

    return clusters.get(normalized)!;
  };

  await readCsv(arquivos.antenas, (row) => {
    const cluster = getCluster(row.cluster);

    cluster.municipio = cluster.municipio || row.municipio;
    cluster.latitude = cluster.latitude ?? round(toNumber(row.lat), 6);
    cluster.longitude = cluster.longitude ?? round(toNumber(row.lon), 6);
  });

  await readCsv(arquivos.assinantes, (row) => {
    const cluster = getCluster(row.home_cluster);

    cluster.municipio = cluster.municipio || row.home_municipio;
    cluster.totalAssinantes += 1;
    increment(cluster.ageGroups, row.age_group);
    increment(cluster.incomeClusters, row.income_cluster);
    increment(cluster.mobilityPatterns, row.mobility_pattern);
  });

  await readCsv(arquivos.fluxoVias, (row) => {
    const origem = getCluster(row.cluster_origem);
    const destino = getCluster(row.cluster_destino);
    const usuarios = toNumber(row.n_usuarios);
    const transicoes = toNumber(row.n_transicoes);

    origem.municipio = origem.municipio || row.municipio_origem;
    origem.latitude = origem.latitude ?? round(toNumber(row.lat_origem), 6);
    origem.longitude = origem.longitude ?? round(toNumber(row.lon_origem), 6);
    origem.fluxoSaidaUsuarios += usuarios;
    origem.fluxoSaidaTransicoes += transicoes;

    destino.municipio = destino.municipio || row.municipio_destino;
    destino.latitude = destino.latitude ?? round(toNumber(row.lat_destino), 6);
    destino.longitude =
      destino.longitude ?? round(toNumber(row.lon_destino), 6);
    destino.fluxoEntradaUsuarios += usuarios;
    destino.fluxoEntradaTransicoes += transicoes;

    periodos[origem.cluster] = periodos[origem.cluster] || {};
    increment(periodos[origem.cluster], row.periodo_predominante, usuarios);
  });

  await readCsv(arquivos.tempoDeslocamento, (row) => {
    const cluster = row.cluster_origem || 'NAO_INFORMADO';
    const observacoes = toNumber(row.n_observacoes);
    const distancia = toNumber(row.dist_media_km);

    distancias[cluster] = distancias[cluster] || {
      totalDistancia: 0,
      totalObservacoes: 0,
    };
    distancias[cluster].totalDistancia += distancia * observacoes;
    distancias[cluster].totalObservacoes += observacoes;
  });

  const mobilityWeights: Record<string, number> = {
    INTENSA: 90,
    MODERADA: 70,
    BAIXA: 45,
    NAO_INFORMADO: 50,
  };

  const resultado = [...clusters.values()]
    .map((cluster) => {
      const distancia = distancias[cluster.cluster];
      const distanciaMedia =
        distancia && distancia.totalObservacoes > 0
          ? distancia.totalDistancia / distancia.totalObservacoes
          : null;
      const scoreBase = weightedAverage(
        cluster.mobilityPatterns,
        mobilityWeights,
      );
      const bonusFluxo = Math.min(
        10,
        Math.log10(Math.max(1, cluster.fluxoSaidaUsuarios)) * 2,
      );
      const bonusDistancia =
        distanciaMedia === null ? 0 : Math.min(5, distanciaMedia / 4);

      return {
        ...cluster,
        mobilityPatternPredominante: topKey(cluster.mobilityPatterns),
        scoreMobilidade: Math.min(
          100,
          Math.round(scoreBase + bonusFluxo + bonusDistancia),
        ),
        fluxoSaidaUsuarios: Math.round(cluster.fluxoSaidaUsuarios),
        fluxoSaidaTransicoes: Math.round(cluster.fluxoSaidaTransicoes),
        fluxoEntradaUsuarios: Math.round(cluster.fluxoEntradaUsuarios),
        fluxoEntradaTransicoes: Math.round(cluster.fluxoEntradaTransicoes),
        distanciaMediaKm:
          distanciaMedia === null ? null : round(distanciaMedia, 3),
        periodoPredominante: periodos[cluster.cluster]
          ? topKey(periodos[cluster.cluster])
          : null,
      };
    })
    .sort((a, b) => b.totalAssinantes - a.totalAssinantes);

  const resumo = {
    geradoEm: new Date().toISOString(),
    fonte: 'data/cdrview',
    totalClusters: resultado.length,
    totalAssinantes: resultado.reduce(
      (sum, cluster) => sum + cluster.totalAssinantes,
      0,
    ),
    arquivosUsados: Object.values(arquivos).map((file) =>
      path.relative(path.resolve(__dirname, '..'), file),
    ),
  };

  fs.writeFileSync(
    path.join(outputDir, 'clusters_mobilidade.json'),
    `${JSON.stringify(resultado, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(outputDir, 'resumo_mobilidade.json'),
    `${JSON.stringify(resumo, null, 2)}\n`,
  );

  console.log(
    `Mobilidade processada: ${resultado.length} clusters, ${resumo.totalAssinantes} assinantes.`,
  );
  console.log(
    `Arquivos gerados em ${path.relative(
      path.resolve(__dirname, '..'),
      outputDir,
    )}`,
  );
}

main().catch((error) => {
  console.error('Erro ao processar mobilidade:', error);
  process.exit(1);
});
