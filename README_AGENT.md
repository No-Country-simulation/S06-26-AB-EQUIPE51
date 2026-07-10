# Agent — Motor de Matching e Scoring de Candidatos (App-BiT)

Módulo responsável pelo pipeline de **matching semântico** entre vagas e candidatos, cálculo de **score ponderado** por critérios, e geração de **resumos justificativos** via LLM local (Ollama). Consumido pelo backend NestJS como serviço de IA do App-BiT.

## Índice

- [Visão geral do pipeline](#visão-geral-do-pipeline)
- [Estrutura de arquivos](#estrutura-de-arquivos)
  - [`embeddings.py`](#embeddingspy)
  - [`scoring.py`](#scoringpy)
  - [`tools.py`](#toolspy)
  - [`agent.py`](#agentpy)
- [Endpoints](#endpoints)
- [LLM (Ollama)](#llm-ollama)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Instalação e execução (Poetry)](#instalação-e-execução-poetry)
- [Pontos de atenção / débito técnico conhecido](#pontos-de-atenção--débito-técnico-conhecido)

## Visão geral do pipeline

```
Vaga + Candidatos (NestJS)
        │
        ▼
┌─────────────────────┐
│  tools.py            │  set_contexto() guarda vaga/candidatos em ContextVar
│  executar_match()    │  filtra elegíveis, chama run_scoring, mescla dados
└─────────┬────────────┘  do NestJS (diversidade/mobilidade) e valida shortlist
          │
          ▼
┌─────────────────────┐
│  scoring.py           │  gera embeddings em lote (fastembed) e calcula
│  run_scoring()        │  score por critério: Cargo, Skills, Nível,
└─────────┬────────────┘  Diversidade, Mobilidade
          │
          ▼
┌─────────────────────┐
│  agent.py              │  para cada candidato da shortlist, chama o LLM
│  rodar_agente()        │  (Qwen via Ollama) para gerar um resumo textual
└─────────┬────────────┘  justificando o score
          │
          ▼
   MatchResponse (schemas.py) → devolvida ao NestJS
```

## Estrutura de arquivos

```
src/agent/
├── agent.py          # Orquestração do agente: LLM + montagem da resposta final
├── embeddings.py      # Wrapper do fastembed (MiniLM-L6-v2) + similaridade de cosseno
├── scoring.py          # Regras de negócio puras: cálculo de score por critério
└── tools.py             # Tool do LangChain, cache de contexto e mesclagem com dados do NestJS
```

### `embeddings.py`
Carrega o modelo `sentence-transformers/all-MiniLM-L6-v2` via `fastembed` (singleton, carregado uma única vez em `get_model()`). Expõe:
- `embed(text)` — gera o embedding de uma única string.
- `cosine_similarity(a, b)` — similaridade de cosseno entre dois vetores.

### `scoring.py`
Contém a lógica **determinística** de pontuação — sem LLM, apenas matemática e embeddings. Os pesos variam por modalidade de trabalho:

| Critério     | Remoto | Híbrido | Presencial |
|--------------|--------|---------|------------|
| Cargo        | 0.35   | 0.30    | 0.25       |
| Skills       | 0.40   | 0.35    | 0.30       |
| Nível        | 0.15   | 0.15    | 0.15       |
| Diversidade  | 0.10   | 0.10    | 0.10       |
| Mobilidade   | 0.00   | 0.10    | 0.20       |

Fluxo de `run_scoring`:
1. Filtra candidatos cujo `cargoDesejado` bate com o cargo da vaga.
2. Gera **todos** os embeddings (cargo + skills de vaga e candidatos) em uma única chamada em lote ao modelo — evita múltiplas chamadas custosas.
3. Avalia cada candidato (`_avaliar_com_embs`) somando a contribuição ponderada de cada critério.
4. Ordena por `score_final` e retorna os top 10 (shortlist), junto com o percentual de diversidade alcançado.

### `tools.py`
Expõe a tool `executar_match` (decorada com `@tool` do LangChain) usada pelo agente. Responsabilidades:
- Mantém `vaga` e `candidatos` em `ContextVar` (via `set_contexto`), evitando reenviar payloads grandes pro LLM.
- Chama `run_scoring` para obter os scores brutos.
- **Mescla dados vindos do NestJS** (`explicacao_backend`, `grupoDiversidade`, `diversidadeCompativel`, `scoreMobilidade`) nos critérios de Diversidade e Mobilidade, sobrescrevendo os valores calculados localmente — o NestJS é a fonte de verdade para esses dois critérios.
- Recalcula o `score_final` após a mesclagem.
- Roda `_validar`, que gera avisos heurísticos (ex: scores todos muito altos, nenhum candidato diverso, nível muito distante).
- Retorna tudo serializado como string (formato dict Python) para ser lido pelo agente.

### `agent.py`
Orquestra o fluxo completo (`rodar_agente`):
1. Chama `set_contexto` e invoca a tool `executar_match`.
2. Faz `ast.literal_eval` do resultado (string → dict).
3. Se a shortlist vier vazia, retorna resposta vazia sem chamar o LLM.
4. Para cada candidato da shortlist, chama o LLM (`_gerar_resumos_com_llm`) **sequencialmente**, pedindo um resumo de até 3 linhas justificando o score.
5. Monta o `MatchResponse` final (`_montar_response`), injetando o resumo gerado em cada `CandidatoScore`.

Em caso de erro/timeout na chamada ao LLM para um candidato específico, o resumo cai para `"Resumo não disponível."` sem interromper o restante do processamento.

## Endpoints

A API é definida em `main.py`. No `lifespan` da aplicação, o modelo de embeddings (`get_model()`) e o LLM (`get_llm()`) são carregados/aquecidos **na subida do servidor**, evitando o custo de cold start na primeira requisição.

CORS está liberado para todas as origens/métodos/headers (`allow_origins=["*"]`) — recomendado revisar antes de produção.

### `POST /match`
Endpoint principal. Recebe uma vaga, busca os candidatos correspondentes e retorna a shortlist com scores e resumos gerados pelo LLM.

- **Body:** `MatchRequest` (contém `empresa_id` e os dados da `vaga`).
- **Fluxo:**
  1. Busca candidatos via `buscar_candidatos(empresa_id, vaga)` (client HTTP para o NestJS).
  2. Se a busca falhar → `502 Bad Gateway`.
  3. Se não houver candidatos → `404 Not Found`.
  4. Caso contrário, roda `rodar_agente(vaga, candidatos)` e retorna um `MatchResponse`.
- **Response:** `MatchResponse` (shortlist com scores, critérios e resumos).

### `GET /health`
Healthcheck simples. Retorna `{"status": "ok"}` — usado para checagem de disponibilidade do serviço (ex: monitoramento, load balancer).

### `GET /debug`
Endpoint de diagnóstico. Busca **todos** os candidatos e **todas** as vagas cadastradas no NestJS (sem filtro) e retorna contagens e uma versão resumida de cada um (`id`, `nome`/`titulo`, `cargo`). Útil para verificar rapidamente se a integração com o backend está trazendo dados.

### `GET /test-sse`
Resquício de uma implementação anterior com Server-Sent Events (via `sse_starlette`, ainda importado no topo do arquivo). Atualmente apenas retorna `{"status": "SSE removido"}` — endpoint efetivamente desativado, candidato a remoção junto com o import não utilizado.

### `POST /debug_match`
Endpoint de depuração para inspecionar o payload bruto recebido pelo servidor, sem passar pela validação do Pydantic (`MatchRequest`). Lê o `Request` diretamente, imprime o corpo no terminal do Uvicorn e devolve o mesmo payload na resposta. Útil para investigar problemas de payload mal formado vindos do frontend/Postman (ex: campo `titulo` não chegando). **Não deve ir para produção.**

> **Nota:** esse endpoint reutiliza o nome de função `match` (mesmo nome de `POST /match`) — funciona porque o FastAPI identifica rotas pelo path, não pelo nome da função Python, mas o nome duplicado é confuso para manutenção e vale renomear (ex: `debug_match`).

## LLM (Ollama)

- Modelo padrão: `qwen2.5:1.5b` (configurável via `OLLAMA_MODEL`).
- Cliente: `ChatOllama` (`langchain-ollama`), instanciado como singleton em `get_llm()`.
- `temperature=0.3`, `num_predict=300`, `timeout=15.0`.
- URL do servidor Ollama definida via variável de ambiente `OLLAMA_URL`.

> **Nota de ambiente (WSL2 + Ollama no Windows):** se a API roda dentro do WSL2 e o Ollama roda nativo no Windows, `localhost` **não** funciona de dentro do WSL2. É necessário:
> 1. Setar `OLLAMA_HOST=0.0.0.0` como variável de ambiente do Windows e reiniciar o Ollama, para que ele aceite conexões externas (por padrão só escuta em `127.0.0.1`).
> 2. Configurar `OLLAMA_URL` no `.env` da API apontando para o IP do host Windows visto pelo WSL2 (ex: `http://172.25.64.1:11434` — obtido via `cat /etc/resolv.conf` dentro do WSL2, pode variar entre reinicializações).

## Variáveis de ambiente

| Variável       | Descrição                                   | Padrão            |
|----------------|----------------------------------------------|--------------------|
| `OLLAMA_MODEL` | Nome do modelo Ollama usado para os resumos  | `qwen2.5:1.5b`     |
| `OLLAMA_URL`   | URL base do servidor Ollama                  | *(obrigatório)*    |

## Instalação e execução (Poetry)

```bash
# Instalar dependências
poetry install

# Ativar o ambiente virtual
poetry shell

# Rodar a API
poetry run uvicorn main:app --reload
```

Pré-requisitos:
- [Ollama](https://ollama.com) instalado e rodando, com o modelo baixado:
  ```bash
  ollama pull qwen2.5:1.5b
  ```
- Arquivo `.env` preenchido a partir do `.envexample`, com `OLLAMA_URL` apontando para o servidor Ollama correto.

## Pontos de atenção / débito técnico conhecido

- A geração de resumos em `_gerar_resumos_com_llm` é **sequencial** (um candidato por vez) — para shortlists grandes, isso pode ser lento. Paralelizar com `asyncio.gather` é uma otimização futura.
- `executar_match` retorna uma **string** (via `str(dict)`) em vez de JSON, exigindo `ast.literal_eval` no lado do agente — funciona, mas é frágil a mudanças de formatação; migrar para `json.dumps`/`json.loads` é mais robusto.
- Os `print()` de debug em `agent.py` e `tools.py` devem ser removidos ou trocados por `logger.debug` antes de produção.