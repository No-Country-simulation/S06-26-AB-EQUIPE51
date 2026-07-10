import { Cargo, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'node:fs';
import * as path from 'node:path';

const prisma = new PrismaClient();

type CandidatoSeed = {
  nome: string;
  email: string;
  cargoDesejado: string;
  skills: string[];
  nivel: string;
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

function carregarCandidatosNoCountry(
  cidadePadrao: string,
): CandidatoSeed[] | null {
  const arquivo = path.resolve(
    __dirname,
    '..',
    'data',
    'cdrview',
    'processados',
    'candidatos_mobilidade_100.json',
  );

  if (!fs.existsSync(arquivo)) {
    return null;
  }

  const candidatos = JSON.parse(
    fs.readFileSync(arquivo, 'utf8'),
  ) as CandidatoSeed[];

  if (!Array.isArray(candidatos) || candidatos.length === 0) {
    return null;
  }

  return candidatos.map((candidato) => ({
    ...candidato,
    regiao: candidato.regiao || cidadePadrao,
    gruposDiversidade:
      candidato.gruposDiversidade ??
      (candidato.grupoDiversidade
        ? [candidato.grupoDiversidade]
        : []),
  }));
}

async function limparBanco() {
  console.log('Limpando banco...');

  const tabelaMatchResultados = await prisma.$queryRaw<
    Array<{ nome: string | null }>
  >`SELECT to_regclass('public.match_resultados')::text AS nome`;

  if (tabelaMatchResultados[0]?.nome) {
    await prisma.$executeRawUnsafe('DELETE FROM "match_resultados"');
  }

  await prisma.logAcessoCandidato.deleteMany();
  await prisma.logCandidato.deleteMany();
  await prisma.logAuth.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.logVaga.deleteMany();
  await prisma.logEmpresa.deleteMany();
  await prisma.vaga.deleteMany();
  await prisma.candidato.deleteMany();
  await prisma.empresa.deleteMany();
  await prisma.usuario.deleteMany();
}

async function criarEmpresas(senhaPadrao: string) {
  console.log('Criando empresas e vagas...');

  const cidadePadrao = 'Florianopolis';
  const latitudePadrao = -27.590569;
  const longitudePadrao = -48.557111;

  const empresas = [
    {
      nome: 'Ana Souza',
      email: 'ana@techdiversity.com',
      nomeEmpresa: 'Tech Diversity',
      metaDiversidade: 50,
      gruposPrioritarios: ['MULHER', 'PCD'],
      vagas: [
        {
          titulo: 'Backend NestJS',
          cargo: 'BACKEND_DEVELOPER',
          modalidade: 'HIBRIDO' as const,
          nivel: 'PLENO',
          regiao: cidadePadrao,
          latitude: latitudePadrao,
          longitude: longitudePadrao,
          skills: ['NestJS', 'Prisma', 'PostgreSQL'],
        },
        {
          titulo: 'Frontend React',
          cargo: 'FRONTEND_DEVELOPER',
          modalidade: 'HIBRIDO' as const,
          nivel: 'PLENO',
          regiao: cidadePadrao,
          latitude: latitudePadrao,
          longitude: longitudePadrao,
          skills: ['React', 'TypeScript', 'CSS'],
        },
      ],
    },
    {
      nome: 'Carlos Mendes',
      email: 'carlos@inovabrasil.com',
      nomeEmpresa: 'Inova Brasil',
      metaDiversidade: 45,
      gruposPrioritarios: ['MULHER', 'LGBTQIA+'],
      vagas: [
        {
          titulo: 'Analista de Dados',
          cargo: 'DATA_ANALYST',
          modalidade: 'HIBRIDO' as const,
          nivel: 'PLENO',
          regiao: cidadePadrao,
          latitude: latitudePadrao,
          longitude: longitudePadrao,
          skills: ['Python', 'SQL', 'Power BI'],
        },
        {
          titulo: 'UX Designer',
          cargo: 'UX_DESIGNER',
          modalidade: 'REMOTO' as const,
          nivel: 'JUNIOR',
          regiao: cidadePadrao,
          latitude: latitudePadrao,
          longitude: longitudePadrao,
          skills: ['Figma', 'UX Research', 'Design System'],
        },
      ],
    },
    {
      nome: 'Mariana Lima',
      email: 'mariana@impactotech.com',
      nomeEmpresa: 'Impacto Tech',
      metaDiversidade: 60,
      gruposPrioritarios: ['MULHER', 'NEGRO', 'PCD'],
      vagas: [
        {
          titulo: 'Desenvolvedor Full Stack',
          cargo: 'FULLSTACK_DEVELOPER',
          modalidade: 'HIBRIDO' as const,
          nivel: 'PLENO',
          regiao: cidadePadrao,
          latitude: latitudePadrao,
          longitude: longitudePadrao,
          skills: ['React', 'NestJS', 'PostgreSQL'],
        },
        {
          titulo: 'QA Tester',
          cargo: 'QA_ENGINEER',
          modalidade: 'REMOTO' as const,
          nivel: 'JUNIOR',
          regiao: cidadePadrao,
          latitude: latitudePadrao,
          longitude: longitudePadrao,
          skills: ['Testes Manuais', 'Cypress', 'Jest'],
        },
      ],
    },
    {
      nome: 'Roberto Lima',
      email: 'roberto@globalmining.com',
      nomeEmpresa: 'Global Mining',
      metaDiversidade: 30,
      gruposPrioritarios: ['NEGRO', 'INDIGENA'],
      vagas: [
        {
          titulo: 'DevOps Cloud',
          cargo: 'DEVOPS_ENGINEER',
          modalidade: 'PRESENCIAL' as const,
          nivel: 'SENIOR',
          regiao: cidadePadrao,
          latitude: latitudePadrao,
          longitude: longitudePadrao,
          skills: ['AWS', 'Docker', 'Kubernetes'],
        },
      ],
    },
    {
      nome: 'Patricia Gomes',
      email: 'patricia@healthinclusive.com',
      nomeEmpresa: 'Health Inclusive',
      metaDiversidade: 55,
      gruposPrioritarios: ['PCD', 'MULHER', 'LGBTQIA+'],
      vagas: [
        {
          titulo: 'Product Manager',
          cargo: 'PRODUCT_MANAGER',
          modalidade: 'HIBRIDO' as const,
          nivel: 'SENIOR',
          regiao: cidadePadrao,
          latitude: latitudePadrao,
          longitude: longitudePadrao,
          skills: ['Produto', 'Scrum', 'Analytics'],
        },
        {
          titulo: 'Analista BI',
          cargo: 'DATA_ANALYST',
          modalidade: 'REMOTO' as const,
          nivel: 'PLENO',
          regiao: cidadePadrao,
          latitude: latitudePadrao,
          longitude: longitudePadrao,
          skills: ['Power BI', 'SQL', 'ETL'],
        },
      ],
    },
    {
      nome: 'Helena Costa',
      email: 'helena@fintechverde.com',
      nomeEmpresa: 'Fintech Verde',
      metaDiversidade: 65,
      gruposPrioritarios: ['NEGRO', 'MULHER'],
      vagas: [
        {
          titulo: 'Data Engineer',
          cargo: 'DATA_ENGINEER',
          modalidade: 'REMOTO' as const,
          nivel: 'SENIOR',
          regiao: cidadePadrao,
          latitude: latitudePadrao,
          longitude: longitudePadrao,
          skills: ['Python', 'Airflow', 'PostgreSQL'],
        },
        {
          titulo: 'Mobile Flutter',
          cargo: 'MOBILE_DEVELOPER',
          modalidade: 'REMOTO' as const,
          nivel: 'PLENO',
          regiao: cidadePadrao,
          latitude: latitudePadrao,
          longitude: longitudePadrao,
          skills: ['Flutter', 'Dart', 'Firebase'],
        },
      ],
    },
  ];

  for (const empresa of empresas) {
    await prisma.usuario.create({
      data: {
        nome: empresa.nome,
        email: empresa.email,
        senha: senhaPadrao,
        role: 'EMPRESA',
        empresa: {
          create: {
            nomeEmpresa: empresa.nomeEmpresa,
            metaDiversidade: empresa.metaDiversidade,
            gruposPrioritarios: empresa.gruposPrioritarios,
            vagas: {
              create: empresa.vagas.map((vaga) => ({
                ...vaga,
                cargo: vaga.cargo,
                modalidade: vaga.modalidade,
              })),
            },
          },
        },
      },
    });
  }

  await prisma.usuario.create({
    data: {
      nome: 'Empresa Inativa',
      email: 'inativa@appbit.com',
      senha: senhaPadrao,
      role: 'EMPRESA',
      ativo: false,
      empresa: {
        create: {
          nomeEmpresa: 'Empresa Inativa',
          metaDiversidade: 10,
          gruposPrioritarios: ['MULHER'],
          ativo: false,
        },
      },
    },
  });
}

async function criarUsuariosSistema(senhaPadrao: string) {
  console.log('Criando usuarios do sistema...');

  await prisma.usuario.createMany({
    data: [
      {
        nome: 'Admin App BiT',
        email: 'admin@appbit.com',
        senha: senhaPadrao,
        role: 'ADMIN',
      },
      {
        nome: 'Auditoria App BiT',
        email: 'auditoria@appbit.com',
        senha: senhaPadrao,
        role: 'ADMIN',
      },
    ],
  });
}

async function criarCandidatos(senhaPadrao: string) {
  console.log('Criando candidatos para matching...');

  const cidadeTalentos = 'Florianopolis';

  const candidatos = carregarCandidatosNoCountry(cidadeTalentos) ?? [
    {
      nome: 'Maria Silva',
      email: 'maria.silva@email.com',
      cargoDesejado: 'BACKEND_DEVELOPER',
      skills: ['NestJS', 'Prisma', 'PostgreSQL', 'Node.js'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      gruposDiversidade: ['MULHER', 'PCD'],
      latitude: -27.585,
      longitude: -48.544722,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 88,
    },
    {
      nome: 'Pedro Almeida',
      email: 'pedro.almeida@email.com',
      cargoDesejado: 'BACKEND_DEVELOPER',
      skills: ['NestJS', 'Prisma', 'PostgreSQL', 'Docker', 'TypeScript'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      gruposDiversidade: ['PCD', 'NEGRO'],
      latitude: -27.582264,
      longitude: -48.534361,
      ageGroup: '35-44',
      incomeCluster: 'C',
      mobilityPattern: 'MODERADA',
      scoreMobilidade: 74,
    },
    {
      nome: 'Fernanda Rocha',
      email: 'fernanda.rocha@email.com',
      cargoDesejado: 'FRONTEND_DEVELOPER',
      skills: ['React', 'TypeScript', 'CSS', 'Figma'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      gruposDiversidade: ['MULHER', 'LGBTQIA+'],
      latitude: -27.5834,
      longitude: -48.544683,
      ageGroup: '25-34',
      incomeCluster: 'B',
      mobilityPattern: 'MODERADA',
      scoreMobilidade: 81,
    },
    {
      nome: 'Joao Santos',
      email: 'joao.santos@email.com',
      cargoDesejado: 'BACKEND_DEVELOPER',
      skills: ['NestJS', 'Prisma', 'PostgreSQL', 'TypeScript', 'APIs REST'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      gruposDiversidade: ['NEGRO'],
      latitude: -27.591528,
      longitude: -48.552775,
      ageGroup: '35-44',
      incomeCluster: 'B',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 69,
    },
    {
      nome: 'Camila Oliveira',
      email: 'camila.oliveira@email.com',
      cargoDesejado: 'UX_DESIGNER',
      skills: ['Figma', 'UX Research', 'Design System', 'Prototipacao'],
      nivel: 'JUNIOR',
      regiao: cidadeTalentos,
      gruposDiversidade: ['MULHER'],
      latitude: -27.658331,
      longitude: -48.505831,
      ageGroup: '18-24',
      incomeCluster: 'C',
      mobilityPattern: 'BAIXA',
      scoreMobilidade: 55,
    },
    {
      nome: 'Larissa Costa',
      email: 'larissa.costa@email.com',
      cargoDesejado: 'FULLSTACK_DEVELOPER',
      skills: ['React', 'NestJS', 'PostgreSQL', 'TypeScript', 'Prisma'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      gruposDiversidade: ['LGBTQIA+', 'PCD'],
      latitude: -27.573889,
      longitude: -48.431667,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 77,
    },
    {
      nome: 'Aline Barbosa',
      email: 'aline.barbosa@email.com',
      cargoDesejado: 'DATA_ANALYST',
      skills: ['Python', 'SQL', 'Power BI', 'Machine Learning', 'ETL'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      gruposDiversidade: ['PCD', 'INDIGENA'],
      latitude: -27.590569,
      longitude: -48.557111,
      ageGroup: '25-34',
      incomeCluster: 'D',
      mobilityPattern: 'MODERADA',
      scoreMobilidade: 72,
    },
    {
      nome: 'Rafael Martins',
      email: 'rafael.martins@email.com',
      cargoDesejado: 'DATA_ANALYST',
      skills: ['Python', 'SQL', 'Power BI'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      gruposDiversidade: ['MULHER', 'LGBTQIA+'],
      latitude: -27.705278,
      longitude: -48.505556,
      ageGroup: '35-44',
      incomeCluster: 'C',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 84,
    },
    {
      nome: 'Diego Pereira',
      email: 'diego.pereira@email.com',
      cargoDesejado: 'BACKEND_DEVELOPER',
      skills: ['Node.js', 'Express', 'PostgreSQL'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      gruposDiversidade: ['INDIGENA', 'NEGRO'],
      latitude: -27.585,
      longitude: -48.544722,
      ageGroup: '45-54',
      incomeCluster: 'D',
      mobilityPattern: 'BAIXA',
      scoreMobilidade: 42,
    },
    {
      nome: 'Bruno Ferreira',
      email: 'bruno.ferreira@email.com',
      cargoDesejado: 'DEVOPS_ENGINEER',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      nivel: 'SENIOR',
      regiao: cidadeTalentos,
      gruposDiversidade: ['NEGRO'],
      latitude: -27.582264,
      longitude: -48.534361,
      ageGroup: '35-44',
      incomeCluster: 'B',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 90,
    },
    {
      nome: 'Yara Tukano',
      email: 'yara.tukano@email.com',
      cargoDesejado: 'DEVOPS_ENGINEER',
      skills: ['AWS', 'Linux', 'Docker'],
      nivel: 'SENIOR',
      regiao: cidadeTalentos,
      gruposDiversidade: ['INDIGENA', 'MULHER'],
      latitude: -27.5834,
      longitude: -48.544683,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'MODERADA',
      scoreMobilidade: 68,
    },
    {
      nome: 'Thais Nascimento',
      email: 'thais.nascimento@email.com',
      cargoDesejado: 'QA_ENGINEER',
      skills: ['Testes Manuais', 'Cypress', 'Jest'],
      nivel: 'JUNIOR',
      regiao: cidadeTalentos,
      gruposDiversidade: ['MULHER', 'PCD'],
      latitude: -27.591528,
      longitude: -48.552775,
      ageGroup: '18-24',
      incomeCluster: 'D',
      mobilityPattern: 'MODERADA',
      scoreMobilidade: 73,
    },
    {
      nome: 'Candidato Sem Grupo',
      email: 'sem.grupo@email.com',
      cargoDesejado: 'DATA_ANALYST',
      skills: ['Python', 'Excel', 'SQL'],
      nivel: 'JUNIOR',
      regiao: cidadeTalentos,
      gruposDiversidade: [],
      latitude: -27.658331,
      longitude: -48.505831,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'BAIXA',
      scoreMobilidade: 30,
    },
    {
      nome: 'Priscila Alves',
      email: 'priscila.alves@email.com',
      cargoDesejado: 'PRODUCT_MANAGER',
      skills: ['Produto', 'Scrum', 'Analytics', 'Discovery'],
      nivel: 'SENIOR',
      regiao: cidadeTalentos,
      gruposDiversidade: ['MULHER'],
      latitude: -27.573889,
      longitude: -48.431667,
      ageGroup: '35-44',
      incomeCluster: 'B',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 86,
    },
    {
      nome: 'Renata Campos',
      email: 'renata.campos@email.com',
      cargoDesejado: 'PRODUCT_MANAGER',
      skills: ['Produto', 'Kanban', 'UX Research'],
      nivel: 'SENIOR',
      regiao: cidadeTalentos,
      gruposDiversidade: ['PCD', 'LGBTQIA+'],
      latitude: -27.590569,
      longitude: -48.557111,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'MODERADA',
      scoreMobilidade: 70,
    },
    {
      nome: 'Lucas Menezes',
      email: 'lucas.menezes@email.com',
      cargoDesejado: 'DATA_ANALYST',
      skills: ['Power BI', 'SQL', 'ETL', 'Python'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      gruposDiversidade: ['LGBTQIA+', 'NEGRO'],
      latitude: -27.705278,
      longitude: -48.505556,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 82,
    },
    {
      nome: 'Samira Rodrigues',
      email: 'samira.rodrigues@email.com',
      cargoDesejado: 'DATA_ANALYST',
      skills: ['Power BI', 'Excel', 'SQL'],
      nivel: 'JUNIOR',
      regiao: cidadeTalentos,
      gruposDiversidade: ['NEGRO', 'INDIGENA'],
      latitude: -27.585,
      longitude: -48.544722,
      ageGroup: '18-24',
      incomeCluster: 'D',
      mobilityPattern: 'BAIXA',
      scoreMobilidade: 48,
    },
    {
      nome: 'Andre Luiz',
      email: 'andre.luiz@email.com',
      cargoDesejado: 'DATA_ENGINEER',
      skills: ['Python', 'Airflow', 'PostgreSQL', 'Spark'],
      nivel: 'SENIOR',
      regiao: cidadeTalentos,
      gruposDiversidade: ['NEGRO', 'PCD'],
      latitude: -27.582264,
      longitude: -48.534361,
      ageGroup: '35-44',
      incomeCluster: 'B',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 89,
    },
    {
      nome: 'Natalia Freitas',
      email: 'natalia.freitas@email.com',
      cargoDesejado: 'DATA_ENGINEER',
      skills: ['Python', 'PostgreSQL', 'dbt'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      gruposDiversidade: ['MULHER', 'LGBTQIA+'],
      latitude: -27.5834,
      longitude: -48.544683,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'MODERADA',
      scoreMobilidade: 66,
    },
    {
      nome: 'Eduardo Souza',
      email: 'eduardo.souza@email.com',
      cargoDesejado: 'MOBILE_DEVELOPER',
      skills: ['Flutter', 'Dart', 'Firebase'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      gruposDiversidade: ['NEGRO'],
      latitude: -27.591528,
      longitude: -48.552775,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 84,
    },
    {
      nome: 'Bianca Ramos',
      email: 'bianca.ramos@email.com',
      cargoDesejado: 'MOBILE_DEVELOPER',
      skills: ['Flutter', 'Dart', 'UX'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      gruposDiversidade: ['MULHER'],
      latitude: -27.658331,
      longitude: -48.505831,
      ageGroup: '18-24',
      incomeCluster: 'D',
      mobilityPattern: 'MODERADA',
      scoreMobilidade: 71,
    },
    {
      nome: 'Marcos Vieira',
      email: 'marcos.vieira@email.com',
      cargoDesejado: 'BACKEND_DEVELOPER',
      skills: ['Java', 'Spring Boot', 'PostgreSQL'],
      nivel: 'SENIOR',
      regiao: cidadeTalentos,
      gruposDiversidade: ['PCD', 'INDIGENA'],
      latitude: -27.573889,
      longitude: -48.431667,
      ageGroup: '35-44',
      incomeCluster: 'B',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 78,
    },
    {
      nome: 'Isis Pereira',
      email: 'isis.pereira@email.com',
      cargoDesejado: 'QA_ENGINEER',
      skills: ['Cypress', 'Jest', 'Automacao'],
      nivel: 'JUNIOR',
      regiao: cidadeTalentos,
      gruposDiversidade: ['LGBTQIA+', 'INDIGENA'],
      latitude: -27.590569,
      longitude: -48.557111,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'BAIXA',
      scoreMobilidade: 58,
    },
  ];

  for (const candidato of candidatos) {
    await prisma.usuario.create({
      data: {
        nome: candidato.nome,
        email: candidato.email,
        senha: senhaPadrao,
        role: 'CANDIDATO',
        candidato: {
          create: {
            skills: candidato.skills,
            nivel: candidato.nivel,
            cargoDesejado: candidato.cargoDesejado as Cargo,
            regiao: candidato.regiao,
            gruposDiversidade: candidato.gruposDiversidade,
            latitude: candidato.latitude,
            longitude: candidato.longitude,
            ageGroup: candidato.ageGroup,
            incomeCluster: candidato.incomeCluster,
            mobilityPattern: candidato.mobilityPattern,
            scoreMobilidade: candidato.scoreMobilidade,
          },
        },
      },
    });
  }

  await prisma.usuario.create({
    data: {
      nome: 'Candidato Extra',
      email: 'candidato.extra@email.com',
      senha: senhaPadrao,
      role: 'CANDIDATO',
      candidato: {
        create: {
          skills: ['Python', 'SQL', 'Power BI'],
          nivel: 'PLENO',
          cargoDesejado: 'DATA_ANALYST',
          regiao: 'Florianopolis',
          gruposDiversidade: ['MULHER'],
          latitude: -27.705278,
          longitude: -48.505556,
          ageGroup: '25-34',
          incomeCluster: 'C',
          mobilityPattern: 'INTENSA',
          scoreMobilidade: 100,
        },
      },
    },
  });
}

function imprimirResumo() {
  console.log('Seed finalizado com sucesso!');
  console.log('');
  console.log('Logins para Postman:');
  console.log('ADMIN    admin@appbit.com / 123456');
  console.log('EMPRESA  ana@techdiversity.com / 123456');
  console.log('EMPRESA  carlos@inovabrasil.com / 123456');
  console.log('EMPRESA  mariana@impactotech.com / 123456');
  console.log('EMPRESA  roberto@globalmining.com / 123456');
  console.log('EMPRESA  patricia@healthinclusive.com / 123456');
  console.log('EMPRESA  helena@fintechverde.com / 123456');
  console.log('');
  console.log('Cenarios de teste:');
  console.log('1. /match dados Florianopolis');
  console.log('   use o id UUID da empresa Inova Brasil retornado pela API');
  console.log('   vaga: Python, SQL, Power BI | PLENO | Florianopolis');
  console.log('   esperado: Rafael score 99 MULHER/LGBTQIA+ ALTA_COMPATIBILIDADE');
  console.log('   esperado: Aline score 84 PCD TALENTO_REGIONAL');
  console.log('');
  console.log('2. /match backend BH');
  console.log('   use o id UUID da empresa Tech Diversity retornado pela API');
  console.log('   vaga: NestJS, Prisma, PostgreSQL | PLENO | Florianopolis');
  console.log('   esperado: Maria no topo e Pedro bem posicionado');
  console.log('');
  console.log('3. Isolamento por empresa');
  console.log('   token Carlos nao deve acessar empresas de outro usuario por ID');
  console.log('   admin deve acessar todas');
  console.log('');
  console.log('4. /match novos cenarios');
  console.log('   Health Inclusive | Produto/BI');
  console.log('   Fintech Verde | Data Engineer/Mobile');
}

async function main() {
  await limparBanco();

  const senhaPadrao = await bcrypt.hash('123456', 10);

  await criarEmpresas(senhaPadrao);
  await criarUsuariosSistema(senhaPadrao);
  await criarCandidatos(senhaPadrao);
  imprimirResumo();
}

main()
  .catch((erro) => {
    console.error('Erro ao executar seed:', erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
