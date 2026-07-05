# App-BiT — API de recrutamento inclusivo

Backend do App-BiT, uma plataforma de recrutamento que conecta empresas e candidatos por compatibilidade técnica, localização, mobilidade e objetivos de diversidade.

## Funcionalidades

- Cadastro e gerenciamento de empresas, candidatos e vagas.
- Autenticação JWT com access token e rotação de refresh token.
- Controle de acesso por perfil: `ADMIN`, `EMPRESA` e `CANDIDATO`.
- Matching de candidatos por cargo, skills, nível, modalidade, região, mobilidade e diversidade.
- Filtro anti-viés e percentual mínimo de diversidade na shortlist.
- Mapa de talentos e indicadores agregados por região.
- Dashboard com os últimos registros de cada perfil.
- Auditoria de autenticação e alterações em empresas, candidatos e vagas.
- Validação e normalização dos dados recebidos pela API.

## Tecnologias

- Node.js e TypeScript
- NestJS 11
- PostgreSQL
- Prisma ORM
- Passport e JWT
- bcrypt
- class-validator e class-transformer
- Jest e Supertest

## Pré-requisitos

- Node.js 20 ou superior
- npm
- PostgreSQL em execução

## Instalação

Entre na pasta do backend e instale as dependências:

```bash
cd BackEnd-v2
npm install
```

Crie o arquivo `.env` dentro de `BackEnd-v2`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/appbit?schema=public"
JWT_SECRET="troque-por-uma-chave-segura"
JWT_REFRESH_SECRET="troque-por-outra-chave-segura"
PORT=3000
```

As chaves JWT de desenvolvimento existentes no código são apenas fallback local e não devem ser usadas em produção.

Prepare o banco e, se desejar, carregue os dados de demonstração:

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

Inicie a aplicação:

```bash
npm run start:dev
```

A API ficará disponível em `http://localhost:3000`.

## Autenticação

Após o login, envie o access token nas rotas privadas:

```http
Authorization: Bearer SEU_ACCESS_TOKEN
```

O access token expira em 15 minutos. O refresh token expira em 7 dias e é substituído a cada renovação.

Exemplo de login:

```json
POST /auth/login
{
  "email": "admin@appbit.com",
  "senha": "123456"
}
```

Exemplo de renovação:

```json
POST /auth/refresh
{
  "refresh_token": "SEU_REFRESH_TOKEN"
}
```

Exemplo de logout:

```json
POST /auth/logout
{
  "refresh_token": "SEU_REFRESH_TOKEN"
}
```

O logout também pode usar o cookie `appbit_refresh_token` criado no login. Ele revoga o refresh token atual e limpa o cookie; o access token já emitido continua válido até expirar.

## Perfis e permissões

| Perfil      | Permissões principais                                                         |
| ----------- | ----------------------------------------------------------------------------- |
| `ADMIN`     | Consulta e administra todos os registros, executa matching e acessa insights. |
| `EMPRESA`   | Gerencia a própria empresa e suas vagas, executa matching e acessa insights.  |
| `CANDIDATO` | Gerencia o próprio perfil e consulta vagas.                                   |

Os cadastros de empresas e candidatos são exclusivos do administrador. As demais rotas exigem autenticação conforme a tabela de endpoints.

## Endpoints

As atualizações são parciais e utilizam o método `PATCH`; a API não utiliza `PUT`.

### Autenticação

| Método | Rota            | Acesso  | Função                                      |
| ------ | --------------- | ------- | ------------------------------------------- |
| `POST` | `/auth/login`   | Público | Autentica um usuário e retorna os tokens.   |
| `POST` | `/auth/refresh` | Público | Valida, revoga e substitui o refresh token. |
| `POST` | `/auth/logout`  | Público | Revoga o refresh token atual e limpa o cookie. |

### Empresas

| Método   | Rota            | Acesso                | Função                                              |
| -------- | --------------- | --------------------- | --------------------------------------------------- |
| `POST`   | `/empresas`     | Admin                 | Cadastra o usuário e a empresa.                     |
| `GET`    | `/empresas`     | Empresa ou admin      | Lista empresas respeitando o escopo do usuário.     |
| `GET`    | `/empresas/me`  | Empresa               | Retorna a empresa vinculada ao usuário autenticado. |
| `GET`    | `/empresas/:id` | Empresa dona ou admin | Busca uma empresa por ID.                           |
| `PATCH`  | `/empresas/:id` | Empresa dona ou admin | Atualiza uma empresa.                               |
| `DELETE` | `/empresas/:id` | Empresa dona ou admin | Remove uma empresa.                                 |

Exemplo de cadastro:

```json
{
  "nome": "Ana Souza",
  "email": "ana@empresa.com",
  "senha": "123456",
  "nomeEmpresa": "Empresa Exemplo",
  "metaDiversidade": 40,
  "gruposPrioritarios": ["MULHER", "PCD"]
}
```

### Candidatos

| Método   | Rota              | Acesso                  | Função                                      |
| -------- | ----------------- | ----------------------- | ------------------------------------------- |
| `POST`   | `/candidatos`     | Admin                   | Cadastra o usuário e o perfil do candidato. |
| `GET`    | `/candidatos`     | Admin                   | Lista candidatos.                           |
| `GET`    | `/candidatos/me`  | Candidato               | Retorna o perfil do candidato autenticado.  |
| `GET`    | `/candidatos/:id` | Candidato dono ou admin | Busca um candidato e registra o acesso.     |
| `PATCH`  | `/candidatos/:id` | Candidato dono ou admin | Atualiza um candidato.                      |
| `DELETE` | `/candidatos/:id` | Candidato dono ou admin | Remove um candidato.                        |

Exemplo de cadastro:

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "senha": "123456",
  "skills": ["TypeScript", "NestJS", "PostgreSQL"],
  "nivel": "PLENO",
  "cargoDesejado": "FRONTEND_DEVELOPER",
  "regiao": "Florianópolis",
  "gruposDiversidade": ["MULHER", "PCD"],
  "latitude": -27.5949,
  "longitude": -48.5482,
  "ageGroup": "25-34",
  "incomeCluster": "C",
  "mobilityPattern": "MODERADA",
  "scoreMobilidade": 75
}
```

O campo `cargoDesejado` é obrigatório. Os campos `gruposDiversidade`, `latitude`, `longitude`, `ageGroup`, `incomeCluster`, `mobilityPattern` e `scoreMobilidade` são opcionais.

### Vagas

Todas as rotas de vagas exigem token.

| Método   | Rota                        | Acesso                | Função                                         |
| -------- | --------------------------- | --------------------- | ---------------------------------------------- |
| `POST`   | `/vagas`                    | Empresa ou admin      | Cadastra uma vaga para uma empresa autorizada. |
| `GET`    | `/vagas`                    | Todos os perfis       | Lista vagas respeitando o escopo do usuário.   |
| `GET`    | `/vagas/empresa/:empresaId` | Todos os perfis       | Lista as vagas de uma empresa.                 |
| `GET`    | `/vagas/:id`                | Todos os perfis       | Busca uma vaga por ID.                         |
| `PATCH`  | `/vagas/:id`                | Empresa dona ou admin | Atualiza uma vaga.                             |
| `DELETE` | `/vagas/:id`                | Empresa dona ou admin | Remove uma vaga.                               |

Exemplo de cadastro:

```json
{
  "empresaId": "ID_DA_EMPRESA",
  "titulo": "Pessoa Desenvolvedora Backend",
  "cargo": "BACKEND_DEVELOPER",
  "modalidade": "REMOTO",
  "nivel": "PLENO",
  "latitude": -27.5949,
  "longitude": -48.5482,
  "regiao": "Florianópolis",
  "skills": ["NestJS", "Prisma", "PostgreSQL"]
}
```

Os campos `cargo` e `modalidade` são obrigatórios. `latitude` e `longitude` são opcionais. As modalidades aceitas são `PRESENCIAL`, `HIBRIDO` e `REMOTO`.

Os cargos aceitos são `FRONTEND_DEVELOPER`, `BACKEND_DEVELOPER`, `FULLSTACK_DEVELOPER`, `MOBILE_DEVELOPER`, `DATA_ANALYST`, `DATA_ENGINEER`, `DEVOPS_ENGINEER`, `QA_ENGINEER`, `UX_DESIGNER` e `PRODUCT_MANAGER`.

### Matching

| Método | Rota     | Acesso                | Função                                                               |
| ------ | -------- | --------------------- | -------------------------------------------------------------------- |
| `POST` | `/match` | Empresa dona ou admin | Analisa candidatos ativos e retorna uma shortlist de até 10 pessoas. |

Exemplo:

```json
{
  "empresa_id": "ID_DA_EMPRESA",
  "vaga": {
    "titulo": "Pessoa Desenvolvedora Backend",
    "cargo": "BACKEND_DEVELOPER",
    "modalidade": "REMOTO",
    "skills": ["NestJS", "Prisma", "PostgreSQL"],
    "nivel": "PLENO",
    "regiao": "Florianópolis"
  },
  "filtros": {
    "anti_vies": true,
    "diversidade_minima": 40
  }
}
```

Os pesos variam conforme a modalidade:

| Critério    | Remoto | Híbrido | Presencial |
| ----------- | -----: | ------: | ---------: |
| Cargo       |    35% |     30% |        25% |
| Skills      |    40% |     35% |        30% |
| Nível       |    15% |     15% |        15% |
| Diversidade |    10% |     10% |        10% |
| Mobilidade  |     0% |     10% |        20% |

O cargo é filtrado antes do cálculo: somente candidatos cujo `cargoDesejado` corresponde ao `cargo` da vaga entram no ranking e em `total_analisados`.

Em vagas remotas, região, coordenadas e mobilidade não influenciam o score. A resposta inclui `modalidade_vaga`, cargo desejado, score, destaque, `motivos`, o campo legado `explicacao`, total analisado e diversidade alcançada. A implementação técnica está detalhada em [`docs/matching.md`](docs/matching.md).

### Insights e dashboard

| Método | Rota                           | Acesso           | Função                                                   |
| ------ | ------------------------------ | ---------------- | -------------------------------------------------------- |
| `GET`  | `/insights`                    | Empresa ou admin | Retorna mapa de talentos, total de regiões e candidatos. |
| `GET`  | `/dashboard/ultimos-registros` | Admin            | Retorna até cinco eventos recentes do sistema.           |

No dashboard, o administrador consulta os eventos recentes de autenticação do sistema.

## Auditoria e segurança

- Senhas são armazenadas com hash bcrypt.
- A API registra tentativas de login, renovação de token e logout.
- Alterações em empresas, vagas e candidatos guardam usuário responsável, IP, user agent e dados anteriores/posteriores.
- O acesso a dados de candidatos é auditado com sua finalidade.
- A validação global rejeita campos não previstos nos DTOs.
- Empresas e candidatos só podem alterar recursos próprios; o admin possui acesso global.

## Dados de demonstração

O comando `npx prisma db seed` recria os dados de desenvolvimento. Alguns acessos disponíveis são:

| Perfil  | E-mail                  | Senha    |
| ------- | ----------------------- | -------- |
| Admin   | `admin@appbit.com`      | `123456` |
| Empresa | `ana@techdiversity.com` | `123456` |

Essas credenciais são exclusivamente para ambiente local.

## Scripts

| Comando              | Função                                            |
| -------------------- | ------------------------------------------------- |
| `npm run start:dev`  | Inicia em desenvolvimento com recarga automática. |
| `npm run build`      | Compila o projeto.                                |
| `npm run start:prod` | Executa a versão compilada.                       |
| `npm run lint`       | Analisa e corrige o código com ESLint.            |
| `npm run format`     | Formata os arquivos com Prettier.                 |
| `npm test`           | Executa os testes unitários.                      |
| `npm run test:e2e`   | Executa os testes de ponta a ponta.               |
| `npm run test:cov`   | Executa os testes e gera cobertura.               |

## Postman

Importe o arquivo `postman/App-BiT.postman_collection.json` no Postman. Execute primeiro `Autenticação > Login Admin`; a coleção salvará o token automaticamente. Depois, use as pastas `Candidatos` e `Vagas` para listar e cadastrar registros.

Para carregar os candidatos e as vagas de demonstração antes dos testes:

```bash
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

## Estrutura principal

```text
BackEnd-v2/
├── prisma/              # Schema, migrations e seed
├── scripts/             # Utilitários de cobertura
└── src/
    ├── auth/            # Login, tokens, guards e perfis
    ├── candidatos/      # Cadastro e gestão de candidatos
    ├── dashboard/       # Registros recentes por perfil
    ├── empresas/        # Cadastro e gestão de empresas
    ├── insights/        # Indicadores e mapa de talentos
    ├── logs-*/          # Serviços internos de auditoria
    ├── match/           # Cálculo e ordenação de matching
    ├── prisma/          # Integração com o banco
    └── vagas/           # Cadastro e gestão de vagas
```

## Autor

Ronaldo Wilson de Aguiar
