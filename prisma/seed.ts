import { Cargo, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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

  const empresas = [
    {
      usuarioId: 'usuario-empresa-tech-diversity',
      empresaId: 'empresa-tech-diversity',
      nome: 'Ana Souza',
      email: 'ana@techdiversity.com',
      nomeEmpresa: 'Tech Diversity',
      metaDiversidade: 50,
      gruposPrioritarios: ['MULHER', 'PCD'],
      vagas: [
        {
          id: 'vaga-backend-nestjs-bh',
          titulo: 'Backend NestJS',
          cargo: 'BACKEND_DEVELOPER',
          modalidade: 'HIBRIDO' as const,
          nivel: 'PLENO',
          regiao: 'Belo Horizonte',
          latitude: -19.9167,
          longitude: -43.9345,
          skills: ['NestJS', 'Prisma', 'PostgreSQL'],
        },
        {
          id: 'vaga-frontend-react-bh',
          titulo: 'Frontend React',
          cargo: 'FRONTEND_DEVELOPER',
          modalidade: 'REMOTO' as const,
          nivel: 'PLENO',
          regiao: 'Belo Horizonte',
          latitude: -19.9208,
          longitude: -43.9378,
          skills: ['React', 'TypeScript', 'CSS'],
        },
      ],
    },
    {
      usuarioId: 'usuario-empresa-inova-brasil',
      empresaId: 'empresa-inova-brasil',
      nome: 'Carlos Mendes',
      email: 'carlos@inovabrasil.com',
      nomeEmpresa: 'Inova Brasil',
      metaDiversidade: 45,
      gruposPrioritarios: ['MULHER', 'LGBTQIA+'],
      vagas: [
        {
          id: 'vaga-dados-recife',
          titulo: 'Analista de Dados',
          cargo: 'DATA_ANALYST',
          modalidade: 'HIBRIDO' as const,
          nivel: 'PLENO',
          regiao: 'Florianopolis',
          latitude: -8.0476,
          longitude: -34.877,
          skills: ['Python', 'SQL', 'Power BI'],
        },
        {
          id: 'vaga-ux-sao-paulo',
          titulo: 'UX Designer',
          cargo: 'UX_DESIGNER',
          modalidade: 'REMOTO' as const,
          nivel: 'JUNIOR',
          regiao: 'Sao Paulo',
          latitude: -23.557,
          longitude: -46.639,
          skills: ['Figma', 'UX Research', 'Design System'],
        },
      ],
    },
    {
      usuarioId: 'usuario-empresa-impacto-tech',
      empresaId: 'empresa-impacto-tech',
      nome: 'Mariana Lima',
      email: 'mariana@impactotech.com',
      nomeEmpresa: 'Impacto Tech',
      metaDiversidade: 60,
      gruposPrioritarios: ['MULHER', 'NEGRO', 'PCD'],
      vagas: [
        {
          id: 'vaga-fullstack-rio',
          titulo: 'Desenvolvedor Full Stack',
          cargo: 'FULLSTACK_DEVELOPER',
          modalidade: 'HIBRIDO' as const,
          nivel: 'PLENO',
          regiao: 'Rio de Janeiro',
          latitude: -22.9068,
          longitude: -43.1729,
          skills: ['React', 'NestJS', 'PostgreSQL'],
        },
        {
          id: 'vaga-qa-salvador',
          titulo: 'QA Tester',
          cargo: 'QA_ENGINEER',
          modalidade: 'REMOTO' as const,
          nivel: 'JUNIOR',
          regiao: 'Salvador',
          latitude: -12.9714,
          longitude: -38.5014,
          skills: ['Testes Manuais', 'Cypress', 'Jest'],
        },
      ],
    },
    {
      usuarioId: 'usuario-empresa-global-mining',
      empresaId: 'empresa-global-mining',
      nome: 'Roberto Lima',
      email: 'roberto@globalmining.com',
      nomeEmpresa: 'Global Mining',
      metaDiversidade: 30,
      gruposPrioritarios: ['NEGRO', 'INDIGENA'],
      vagas: [
        {
          id: 'vaga-devops-manaus',
          titulo: 'DevOps Cloud',
          cargo: 'DEVOPS_ENGINEER',
          modalidade: 'PRESENCIAL' as const,
          nivel: 'SENIOR',
          regiao: 'Manaus',
          latitude: -3.119,
          longitude: -60.0217,
          skills: ['AWS', 'Docker', 'Kubernetes'],
        },
      ],
    },
    {
      usuarioId: 'usuario-empresa-health-inclusive',
      empresaId: 'empresa-health-inclusive',
      nome: 'Patricia Gomes',
      email: 'patricia@healthinclusive.com',
      nomeEmpresa: 'Health Inclusive',
      metaDiversidade: 55,
      gruposPrioritarios: ['PCD', 'MULHER', 'LGBTQIA+'],
      vagas: [
        {
          id: 'vaga-product-manager-curitiba',
          titulo: 'Product Manager',
          cargo: 'PRODUCT_MANAGER',
          modalidade: 'HIBRIDO' as const,
          nivel: 'SENIOR',
          regiao: 'Curitiba',
          latitude: -25.4284,
          longitude: -49.2733,
          skills: ['Produto', 'Scrum', 'Analytics'],
        },
        {
          id: 'vaga-bi-brasilia',
          titulo: 'Analista BI',
          cargo: 'DATA_ANALYST',
          modalidade: 'REMOTO' as const,
          nivel: 'PLENO',
          regiao: 'Brasilia',
          latitude: -15.7939,
          longitude: -47.8828,
          skills: ['Power BI', 'SQL', 'ETL'],
        },
      ],
    },
    {
      usuarioId: 'usuario-empresa-fintech-verde',
      empresaId: 'empresa-fintech-verde',
      nome: 'Helena Costa',
      email: 'helena@fintechverde.com',
      nomeEmpresa: 'Fintech Verde',
      metaDiversidade: 65,
      gruposPrioritarios: ['NEGRO', 'MULHER'],
      vagas: [
        {
          id: 'vaga-data-engineer-fortaleza',
          titulo: 'Data Engineer',
          cargo: 'DATA_ENGINEER',
          modalidade: 'REMOTO' as const,
          nivel: 'SENIOR',
          regiao: 'Fortaleza',
          latitude: -3.7319,
          longitude: -38.5267,
          skills: ['Python', 'Airflow', 'PostgreSQL'],
        },
        {
          id: 'vaga-mobile-flutter-poa',
          titulo: 'Mobile Flutter',
          cargo: 'MOBILE_DEVELOPER',
          modalidade: 'REMOTO' as const,
          nivel: 'PLENO',
          regiao: 'Porto Alegre',
          latitude: -30.0346,
          longitude: -51.2177,
          skills: ['Flutter', 'Dart', 'Firebase'],
        },
      ],
    },
  ];

  for (const empresa of empresas) {
    await prisma.usuario.create({
      data: {
        id: empresa.usuarioId,
        nome: empresa.nome,
        email: empresa.email,
        senha: senhaPadrao,
        role: 'EMPRESA',
        empresa: {
          create: {
            id: empresa.empresaId,
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
      id: 'usuario-empresa-inativa',
      nome: 'Empresa Inativa',
      email: 'inativa@appbit.com',
      senha: senhaPadrao,
      role: 'EMPRESA',
      ativo: false,
      empresa: {
        create: {
          id: 'empresa-inativa',
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
        id: 'usuario-admin',
        nome: 'Admin App BiT',
        email: 'admin@appbit.com',
        senha: senhaPadrao,
        role: 'ADMIN',
      },
      {
        id: 'usuario-admin-auditoria',
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

  const candidatos = [
    {
      usuarioId: 'usuario-candidato-maria-silva',
      candidatoId: 'candidato-maria-silva',
      nome: 'Maria Silva',
      email: 'maria.silva@email.com',
      cargoDesejado: 'BACKEND_DEVELOPER',
      skills: ['NestJS', 'Prisma', 'PostgreSQL', 'Node.js'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      grupoDiversidade: 'MULHER',
      latitude: -27.585,
      longitude: -48.544722,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 88,
    },
    {
      usuarioId: 'usuario-candidato-pedro-almeida',
      candidatoId: 'candidato-pedro-almeida',
      nome: 'Pedro Almeida',
      email: 'pedro.almeida@email.com',
      cargoDesejado: 'BACKEND_DEVELOPER',
      skills: ['NestJS', 'PostgreSQL', 'Docker'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      grupoDiversidade: 'PCD',
      latitude: -27.582264,
      longitude: -48.534361,
      ageGroup: '35-44',
      incomeCluster: 'C',
      mobilityPattern: 'MODERADA',
      scoreMobilidade: 74,
    },
    {
      usuarioId: 'usuario-candidato-fernanda-rocha',
      candidatoId: 'candidato-fernanda-rocha',
      nome: 'Fernanda Rocha',
      email: 'fernanda.rocha@email.com',
      cargoDesejado: 'FRONTEND_DEVELOPER',
      skills: ['React', 'TypeScript', 'CSS', 'Figma'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      grupoDiversidade: 'MULHER',
      latitude: -27.5834,
      longitude: -48.544683,
      ageGroup: '25-34',
      incomeCluster: 'B',
      mobilityPattern: 'MODERADA',
      scoreMobilidade: 81,
    },
    {
      usuarioId: 'usuario-candidato-joao-santos',
      candidatoId: 'candidato-joao-santos',
      nome: 'Joao Santos',
      email: 'joao.santos@email.com',
      cargoDesejado: 'BACKEND_DEVELOPER',
      skills: ['NestJS', 'Prisma', 'PostgreSQL'],
      nivel: 'SENIOR',
      regiao: cidadeTalentos,
      grupoDiversidade: 'NEGRO',
      latitude: -27.591528,
      longitude: -48.552775,
      ageGroup: '35-44',
      incomeCluster: 'B',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 69,
    },
    {
      usuarioId: 'usuario-candidato-camila-oliveira',
      candidatoId: 'candidato-camila-oliveira',
      nome: 'Camila Oliveira',
      email: 'camila.oliveira@email.com',
      cargoDesejado: 'UX_DESIGNER',
      skills: ['Figma', 'UX Research', 'Design System'],
      nivel: 'JUNIOR',
      regiao: cidadeTalentos,
      grupoDiversidade: 'MULHER',
      latitude: -27.658331,
      longitude: -48.505831,
      ageGroup: '18-24',
      incomeCluster: 'C',
      mobilityPattern: 'BAIXA',
      scoreMobilidade: 55,
    },
    {
      usuarioId: 'usuario-candidato-larissa-costa',
      candidatoId: 'candidato-larissa-costa',
      nome: 'Larissa Costa',
      email: 'larissa.costa@email.com',
      cargoDesejado: 'FULLSTACK_DEVELOPER',
      skills: ['React', 'NestJS', 'PostgreSQL'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      grupoDiversidade: 'LGBTQIA+',
      latitude: -27.573889,
      longitude: -48.431667,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 77,
    },
    {
      usuarioId: 'usuario-candidato-aline-barbosa',
      candidatoId: 'candidato-aline-barbosa',
      nome: 'Aline Barbosa',
      email: 'aline.barbosa@email.com',
      cargoDesejado: 'DATA_ANALYST',
      skills: ['Python', 'SQL', 'Power BI', 'Machine Learning'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      grupoDiversidade: 'PCD',
      latitude: -27.590569,
      longitude: -48.557111,
      ageGroup: '25-34',
      incomeCluster: 'D',
      mobilityPattern: 'MODERADA',
      scoreMobilidade: 72,
    },
    {
      usuarioId: 'usuario-candidato-rafael-martins',
      candidatoId: 'candidato-rafael-martins',
      nome: 'Rafael Martins',
      email: 'rafael.martins@email.com',
      cargoDesejado: 'DATA_ANALYST',
      skills: ['Python', 'SQL', 'Power BI'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      grupoDiversidade: 'MULHER',
      latitude: -27.705278,
      longitude: -48.505556,
      ageGroup: '35-44',
      incomeCluster: 'C',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 84,
    },
    {
      usuarioId: 'usuario-candidato-diego-pereira',
      candidatoId: 'candidato-diego-pereira',
      nome: 'Diego Pereira',
      email: 'diego.pereira@email.com',
      cargoDesejado: 'BACKEND_DEVELOPER',
      skills: ['Node.js', 'Express', 'MongoDB'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      grupoDiversidade: 'INDIGENA',
      latitude: -27.585,
      longitude: -48.544722,
      ageGroup: '45-54',
      incomeCluster: 'D',
      mobilityPattern: 'BAIXA',
      scoreMobilidade: 42,
    },
    {
      usuarioId: 'usuario-candidato-bruno-ferreira',
      candidatoId: 'candidato-bruno-ferreira',
      nome: 'Bruno Ferreira',
      email: 'bruno.ferreira@email.com',
      cargoDesejado: 'DEVOPS_ENGINEER',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      nivel: 'SENIOR',
      regiao: cidadeTalentos,
      grupoDiversidade: 'NEGRO',
      latitude: -27.582264,
      longitude: -48.534361,
      ageGroup: '35-44',
      incomeCluster: 'B',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 90,
    },
    {
      usuarioId: 'usuario-candidato-yara-tukano',
      candidatoId: 'candidato-yara-tukano',
      nome: 'Yara Tukano',
      email: 'yara.tukano@email.com',
      cargoDesejado: 'DEVOPS_ENGINEER',
      skills: ['AWS', 'Linux', 'Docker'],
      nivel: 'SENIOR',
      regiao: cidadeTalentos,
      grupoDiversidade: 'INDIGENA',
      latitude: -27.5834,
      longitude: -48.544683,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'MODERADA',
      scoreMobilidade: 68,
    },
    {
      usuarioId: 'usuario-candidato-thais-nascimento',
      candidatoId: 'candidato-thais-nascimento',
      nome: 'Thais Nascimento',
      email: 'thais.nascimento@email.com',
      cargoDesejado: 'QA_ENGINEER',
      skills: ['Testes Manuais', 'Cypress', 'Jest'],
      nivel: 'JUNIOR',
      regiao: cidadeTalentos,
      grupoDiversidade: 'MULHER',
      latitude: -27.591528,
      longitude: -48.552775,
      ageGroup: '18-24',
      incomeCluster: 'D',
      mobilityPattern: 'MODERADA',
      scoreMobilidade: 73,
    },
    {
      usuarioId: 'usuario-candidato-sem-grupo',
      candidatoId: 'candidato-sem-grupo',
      nome: 'Candidato Sem Grupo',
      email: 'sem.grupo@email.com',
      cargoDesejado: 'DATA_ANALYST',
      skills: ['Python', 'Excel', 'SQL'],
      nivel: 'JUNIOR',
      regiao: cidadeTalentos,
      grupoDiversidade: null,
      latitude: -27.658331,
      longitude: -48.505831,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'BAIXA',
      scoreMobilidade: 30,
    },
    {
      usuarioId: 'usuario-candidato-priscila-alves',
      candidatoId: 'candidato-priscila-alves',
      nome: 'Priscila Alves',
      email: 'priscila.alves@email.com',
      cargoDesejado: 'PRODUCT_MANAGER',
      skills: ['Produto', 'Scrum', 'Analytics', 'Discovery'],
      nivel: 'SENIOR',
      regiao: cidadeTalentos,
      grupoDiversidade: 'MULHER',
      latitude: -27.573889,
      longitude: -48.431667,
      ageGroup: '35-44',
      incomeCluster: 'B',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 86,
    },
    {
      usuarioId: 'usuario-candidato-renata-campos',
      candidatoId: 'candidato-renata-campos',
      nome: 'Renata Campos',
      email: 'renata.campos@email.com',
      cargoDesejado: 'PRODUCT_MANAGER',
      skills: ['Produto', 'Kanban', 'UX Research'],
      nivel: 'SENIOR',
      regiao: cidadeTalentos,
      grupoDiversidade: 'PCD',
      latitude: -27.590569,
      longitude: -48.557111,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'MODERADA',
      scoreMobilidade: 70,
    },
    {
      usuarioId: 'usuario-candidato-lucas-menezes',
      candidatoId: 'candidato-lucas-menezes',
      nome: 'Lucas Menezes',
      email: 'lucas.menezes@email.com',
      cargoDesejado: 'DATA_ANALYST',
      skills: ['Power BI', 'SQL', 'ETL', 'Python'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      grupoDiversidade: 'LGBTQIA+',
      latitude: -27.705278,
      longitude: -48.505556,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 82,
    },
    {
      usuarioId: 'usuario-candidato-samira-rodrigues',
      candidatoId: 'candidato-samira-rodrigues',
      nome: 'Samira Rodrigues',
      email: 'samira.rodrigues@email.com',
      cargoDesejado: 'DATA_ANALYST',
      skills: ['Power BI', 'Excel', 'SQL'],
      nivel: 'JUNIOR',
      regiao: cidadeTalentos,
      grupoDiversidade: 'NEGRO',
      latitude: -27.585,
      longitude: -48.544722,
      ageGroup: '18-24',
      incomeCluster: 'D',
      mobilityPattern: 'BAIXA',
      scoreMobilidade: 48,
    },
    {
      usuarioId: 'usuario-candidato-andre-luiz',
      candidatoId: 'candidato-andre-luiz',
      nome: 'Andre Luiz',
      email: 'andre.luiz@email.com',
      cargoDesejado: 'DATA_ENGINEER',
      skills: ['Python', 'Airflow', 'PostgreSQL', 'Spark'],
      nivel: 'SENIOR',
      regiao: cidadeTalentos,
      grupoDiversidade: 'NEGRO',
      latitude: -27.582264,
      longitude: -48.534361,
      ageGroup: '35-44',
      incomeCluster: 'B',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 89,
    },
    {
      usuarioId: 'usuario-candidato-natalia-freitas',
      candidatoId: 'candidato-natalia-freitas',
      nome: 'Natalia Freitas',
      email: 'natalia.freitas@email.com',
      cargoDesejado: 'DATA_ENGINEER',
      skills: ['Python', 'PostgreSQL', 'dbt'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      grupoDiversidade: 'MULHER',
      latitude: -27.5834,
      longitude: -48.544683,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'MODERADA',
      scoreMobilidade: 66,
    },
    {
      usuarioId: 'usuario-candidato-eduardo-souza',
      candidatoId: 'candidato-eduardo-souza',
      nome: 'Eduardo Souza',
      email: 'eduardo.souza@email.com',
      cargoDesejado: 'MOBILE_DEVELOPER',
      skills: ['Flutter', 'Dart', 'Firebase'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      grupoDiversidade: 'NEGRO',
      latitude: -27.591528,
      longitude: -48.552775,
      ageGroup: '25-34',
      incomeCluster: 'C',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 84,
    },
    {
      usuarioId: 'usuario-candidato-bianca-ramos',
      candidatoId: 'candidato-bianca-ramos',
      nome: 'Bianca Ramos',
      email: 'bianca.ramos@email.com',
      cargoDesejado: 'MOBILE_DEVELOPER',
      skills: ['Flutter', 'Dart', 'UX'],
      nivel: 'PLENO',
      regiao: cidadeTalentos,
      grupoDiversidade: 'MULHER',
      latitude: -27.658331,
      longitude: -48.505831,
      ageGroup: '18-24',
      incomeCluster: 'D',
      mobilityPattern: 'MODERADA',
      scoreMobilidade: 71,
    },
    {
      usuarioId: 'usuario-candidato-marcos-vieira',
      candidatoId: 'candidato-marcos-vieira',
      nome: 'Marcos Vieira',
      email: 'marcos.vieira@email.com',
      cargoDesejado: 'BACKEND_DEVELOPER',
      skills: ['Java', 'Spring Boot', 'PostgreSQL'],
      nivel: 'SENIOR',
      regiao: cidadeTalentos,
      grupoDiversidade: 'PCD',
      latitude: -27.573889,
      longitude: -48.431667,
      ageGroup: '35-44',
      incomeCluster: 'B',
      mobilityPattern: 'INTENSA',
      scoreMobilidade: 78,
    },
    {
      usuarioId: 'usuario-candidato-isis-pereira',
      candidatoId: 'candidato-isis-pereira',
      nome: 'Isis Pereira',
      email: 'isis.pereira@email.com',
      cargoDesejado: 'QA_ENGINEER',
      skills: ['Cypress', 'Jest', 'Automacao'],
      nivel: 'JUNIOR',
      regiao: cidadeTalentos,
      grupoDiversidade: 'LGBTQIA+',
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
        id: candidato.usuarioId,
        nome: candidato.nome,
        email: candidato.email,
        senha: senhaPadrao,
        role: 'CANDIDATO',
        candidato: {
          create: {
            id: candidato.candidatoId,
            skills: candidato.skills,
            nivel: candidato.nivel,
            cargoDesejado: candidato.cargoDesejado as Cargo,
            regiao: candidato.regiao,
            grupoDiversidade: candidato.grupoDiversidade,
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
      id: 'usuario-candidato-inativo',
      nome: 'Candidato Inativo',
      email: 'candidato.inativo@email.com',
      senha: senhaPadrao,
      role: 'CANDIDATO',
      ativo: false,
      candidato: {
        create: {
          id: 'candidato-inativo',
          skills: ['Python', 'SQL', 'Power BI'],
          nivel: 'PLENO',
          cargoDesejado: 'DATA_ANALYST',
          regiao: 'Recife',
          grupoDiversidade: 'MULHER',
          latitude: -27.705278,
          longitude: -48.505556,
          ageGroup: '25-34',
          incomeCluster: 'C',
          mobilityPattern: 'INTENSA',
          scoreMobilidade: 100,
          ativo: false,
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
  console.log('1. /match dados Recife');
  console.log('   empresa_id: empresa-inova-brasil');
  console.log('   vaga: Python, SQL, Power BI | PLENO | Recife');
  console.log('   esperado: Rafael score 99 MULHER ALTA_COMPATIBILIDADE');
  console.log('   esperado: Aline score 84 PCD TALENTO_REGIONAL');
  console.log('');
  console.log('2. /match backend BH');
  console.log('   empresa_id: empresa-tech-diversity');
  console.log('   vaga: NestJS, Prisma, PostgreSQL | PLENO | Belo Horizonte');
  console.log('   esperado: Maria no topo e Pedro bem posicionado');
  console.log('');
  console.log('3. Isolamento por empresa');
  console.log('   token Carlos nao deve acessar empresa-tech-diversity por ID');
  console.log('   admin deve acessar todas');
  console.log('');
  console.log('4. /match novos cenarios');
  console.log('   empresa_id: empresa-health-inclusive | Produto/BI');
  console.log('   empresa_id: empresa-fintech-verde | Data Engineer/Mobile');
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
