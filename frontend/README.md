# Inclusive Tech - Frontend

Frontend da plataforma **Inclusive Tech (App BiT)** desenvolvido durante o Hackathon No Country.

A aplicação permite que empresas cadastrem vagas, realizem processos de matching com candidatos utilizando Inteligência Artificial e acompanhem indicadores ESG relacionados à diversidade, inclusão e recrutamento.

---

# Tecnologias

- React
- Vite
- React Router
- Axios
- Recharts
- Lucide React
- CSS Modules

---

# Funcionalidades

## Autenticação

- Login JWT
- Refresh Token via Cookie HttpOnly
- Sessão automática
- Logout seguro
- Rotas protegidas

---

## Dashboard

- Listagem das vagas da empresa logada
- Geração de Match
- Visualização dos melhores candidatos
- Score de compatibilidade
- Mapa de Talentos
- Indicadores da empresa

---

## Gestão de Vagas

- Cadastro
- Listagem
- Atualização
- Exclusão
- Alteração de Status

---

## Match IA

Integração com o motor de IA responsável por:

- Analisar candidatos
- Calcular score de compatibilidade
- Aplicar filtros
- Respeitar critérios de diversidade
- Retornar candidatos ranqueados

O frontend apenas envia os filtros e exibe os resultados retornados pelo backend/IA.

---

## Relatório ESG

Dashboard com indicadores ESG baseados no último Match.

Inclui:

- Meta ESG da empresa
- Diversidade alcançada
- Compatibilidade média
- Status da meta
- Distribuição por grupos prioritários
- Compatibilidade por faixa de score
- Privacidade (LGPD)
- Últimas vagas utilizadas
- Impacto ESG do último Match

---

# Estrutura do Projeto

```
src
│
├── assets
├── components
│   ├── ESG
│   ├── Layout
│   ├── MatchIA
│   └── ...
│
├── pages
│   ├── Dashboard
│   ├── Login
│   ├── RelatorioESG
│   ├── MatchIA
│   └── ...
│
├── services
│   ├── api.js
│   ├── authService.js
│   ├── empresaService.js
│   ├── vagaService.js
│   ├── matchService.js
│   └── ...
│
├── store
├── styles
└── utils
```

---

# Arquitetura

```
Usuário

↓

Frontend React

↓

Axios

↓

NestJS Backend

↓

Banco de Dados

↓

Motor IA (FastAPI)

↓

Resposta do Match

↓

Dashboard / Relatório ESG
```

---

# Instalação

Clone o projeto:

```bash
git clone <repositorio>
```

Entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

---

# Variáveis de Ambiente

Crie um arquivo `.env`:

```env
VITE_API_URL=http://localhost:3000
```

ou utilize a URL do backend em produção.

---

# Executando

Desenvolvimento

```bash
npm run dev
```

Build

```bash
npm run build
```

Preview

```bash
npm run preview
```

---

# Comunicação com a API

Todas as chamadas são centralizadas em:

```
src/services
```

Principais serviços:

- authService
- empresaService
- vagaService
- candidatoService
- matchService
- usuarioLogadoService

---

# Fluxo de Autenticação

```
Login

↓

Backend

↓

JWT Access Token

↓

Token em memória

↓

Cookie HttpOnly (Refresh Token)

↓

Axios Interceptor

↓

Renovação automática da sessão
```

---

# Fluxo de Match

```
Selecionar vaga

↓

Selecionar filtros

↓

POST /match

↓

Backend

↓

Motor IA

↓

Lista ranqueada

↓

Dashboard

↓

Relatório ESG
```

---

# Segurança

- JWT
- Refresh Token HttpOnly
- Axios Interceptors
- Rotas protegidas
- Dados anonimizados
- LGPD
- Sessão automática

---

# Status do Projeto

### Implementado

- Login
- Dashboard
- Cadastro de vagas
- Listagem de vagas
- Match IA
- Integração Backend
- Relatório ESG
- Mapa de Talentos
- Refresh Token
- Proteção de rotas


---

# Equipe

Projeto desenvolvido durante o Hackathon **No Country**.

Frontend desenvolvido em React consumindo APIs REST do backend NestJS e do agente de IA em FastAPI.
