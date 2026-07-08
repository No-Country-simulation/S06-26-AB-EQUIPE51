# S06-26-AB-EQUIPE51
# 🌍 InclusiveTech – Inclusive Matching Platform

> Plataforma de recrutamento inclusivo que conecta empresas a talentos de grupos sub-representados através de matching inteligente, indicadores ESG e análise de diversidade.

---

## 📖 Sobre o Projeto

O **InclusiveTech** foi desenvolvido para auxiliar empresas que desejam fortalecer suas iniciativas de diversidade e inclusão, facilitando a identificação e contratação de profissionais de grupos sub-representados.

A plataforma permite que empresas publiquem vagas, encontrem candidatos compatíveis e acompanhem indicadores ESG por meio de dashboards e análises de dados.

---

## 🎯 Objetivo

Promover processos seletivos mais inclusivos e orientados por dados através de:

* 📌 Publicação de vagas
* 🤖 Matching inteligente entre vagas e candidatos
* 📊 Dashboard ESG
* 🏷️ Badges de diversidade
* 🌎 Visualização de talentos por região / Mapa interativo de talentos

---

## 🚀 Funcionalidades do MVP

### Empresas

* Cadastro de empresas
* Configuração de metas ESG

### Recrutamento

* Publicação de vagas
* Matching de candidatos
* Score de compatibilidade
* Badge de diversidade

### Análises

* Dashboard ESG
* Indicadores de diversidade
* Integração com banco de dados

---

## 🛠️ Tecnologias Utilizadas

### 🎨 Frontend

- React.js
- Vite
- JavaScript
- CSS Modules
- Axios
- React Router DOM
- React Hook Form
- Leaflet + leaflet.heat
- React-hot-toast
- Recharts
- React Icons + Lucide React

Integrações:
- API Backend NestJS
- API de Match com Inteligência Artificial
- Autenticação JWT
- Relatórios ESG

---

# 📌 Funcionalidades

## 🔐 Autenticação

- Login de empresas
- Controle de sessão
- JWT Token
- Proteção de rotas privadas

Fluxo:

Login → Backend → JWT → Frontend → Sessão autenticada

---

# 🏢 Dashboard Empresa

- Resumo da empresa
- Vagas cadastradas
- Últimos matches
- Indicadores gerais
- Relatórios ESG

---

# 📋 Gestão de vagas

Permite:

- Criar vagas
- Visualizar vagas
- Definir cargo
- Nível
- Skills
- Modalidade
- Região
- Diversidade mínima

---

# 🤖 Match com IA

Tela responsável pelo ranking inteligente de candidatos.

A IA realiza:

- Compatibilidade técnica
- Ranking
- Score final
- Análise por critérios
- Explicação da decisão

---

# 🌱 Relatório ESG

Indicadores:

- Meta ESG
- Diversidade
- Compatibilidade média
- Grupos prioritários
- Privacidade LGPD

---

# 🧠 Análise Inteligente

Modal contendo:

- Resumo do candidato
- Critérios avaliados
- Pontuação
- Explicação da IA

---

# 🛡️ Segurança

Implementações:

- JWT
- Rotas protegidas
- Controle de sessão
- Minimização de dados
- Boas práticas LGPD

---

### ⚙️ Backend

* NestJs
* Postman (testes e documentação)

### 🧠 Machine Learning

* Python

### ☁️ Infraestrutura & DevOps

* Deploy Backend e Frontend no Railway
* GitHub Actions
* GitHub Projects

### 🔒 Segurança

* JWT
* Bcrypt

---

## 🏗️ Arquitetura da Solução

```text
Empresa / RH
      │
      ▼
Frontend (React)
      │
      ▼
Backend (NestJs)
      │
      ▼
Banco de Dados
      │
      ▼
Motor de Matching / IA
      │
      ▼
Backend
      │
      ▼
Frontend
```

---

## 👥 Equipe

| Integrante                        | Função                  |
| --------------------------------- | ----------------------- |
| Suellen Garcia                    | Project Manager         |
| Ronaldo Wilson de Aguiar          | Backend Developer       |
| Letícia Castro                    | Frontend Developer      |
| Douglas José                      | Data Analyst            |
| Dherek Schaberle                  | Cybersecurity Engineer  |
| Johnny Alejandro Silva de Miranda | Cloud Security Engineer |

---

## 📅 Status do Projeto

🚧 Em Desenvolvimento

Projeto desenvolvido para o Hackathon **BiT App – Inclusive Matching Platform**.

---

## 🌟 Visão de Futuro

Funcionalidades previstas para evolução da plataforma:

* 📄 Relatórios ESG em PDF
* 🔔 Sistema de notificações
* 🤖 Chatbot inteligente
* 📈 Machine Learning avançado para matching

---

## 📌 Missão

Transformar diversidade em oportunidade, conectando empresas e talentos através da tecnologia.
