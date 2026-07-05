# Insights no front

Este documento explica como o front deve consumir a tela de insights por vaga.

## Objetivo

A tela de insights deve mostrar candidatos relacionados a uma vaga especifica da empresa logada.

Exemplo: se a empresa `ana@techdiversity.com` possui uma vaga, o front deve usar o UUID retornado por `GET /vagas`:

```http
GET /insights?vagaId=UUID_DA_VAGA
```

Assim, o backend retorna apenas candidatos ativos cujo `cargoDesejado` seja igual ao `cargo` da vaga.

## Fluxo recomendado

1. Fazer login da empresa.

```http
POST /auth/login
```

Body:

```json
{
  "email": "ana@techdiversity.com",
  "senha": "123456"
}
```

Guardar o `access_token` retornado.

2. Listar as vagas da empresa logada.

```http
GET /vagas
Authorization: Bearer ACCESS_TOKEN
```

Quando o usuario logado for `EMPRESA`, essa rota retorna somente as vagas da empresa dele.

Exemplo de item retornado:

```json
{
  "id": "UUID_DA_VAGA",
  "empresaId": "UUID_DA_EMPRESA",
  "titulo": "Backend NestJS",
  "cargo": "BACKEND_DEVELOPER",
  "modalidade": "HIBRIDO",
  "nivel": "PLENO",
  "regiao": "Florianopolis",
  "latitude": -27.590569,
  "longitude": -48.557111,
  "skills": ["NestJS", "Prisma", "PostgreSQL"]
}
```

3. O usuario escolhe uma vaga no front.

O front deve pegar o `id` da vaga escolhida.

Exemplo:

```ts
const vagaId = vagaSelecionada.id;
```

4. Buscar insights da vaga escolhida.

```http
GET /insights?vagaId=UUID_DA_VAGA
Authorization: Bearer ACCESS_TOKEN
```

Exemplo em TypeScript:

```ts
async function buscarInsightsDaVaga(vagaId: string, token: string) {
  const response = await fetch(
    `${API_URL}/insights?vagaId=${encodeURIComponent(vagaId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Erro ao buscar insights da vaga');
  }

  return response.json();
}
```

## Regra aplicada no backend

Quando `vagaId` e enviado:

1. O backend busca a vaga pelo ID.
2. Se a vaga nao existir, retorna `404`.
3. Se o usuario for empresa, o backend valida se a vaga pertence a empresa logada.
4. Se a vaga nao pertencer a empresa logada, retorna `403`.
5. O backend pega o campo `cargo` da vaga.
6. O backend lista somente candidatos ativos com `cargoDesejado` igual ao `cargo` da vaga.
7. O backend retorna esses candidatos no formato do mapa de talentos.

Exemplo:

```json
{
  "cargo": "BACKEND_DEVELOPER"
}
```

So entram candidatos com:

```json
{
  "cargoDesejado": "BACKEND_DEVELOPER"
}
```

## Resposta do endpoint

```json
{
  "mapa_talentos": [
    {
      "regiao": "Maria Silva",
      "concentracao": 1,
      "cobertura_rede": "Dado agregado",
      "perfis_disponiveis": 1,
      "lat": -27.585,
      "lon": -48.544722
    }
  ],
  "total_regioes": 1,
  "total_candidatos": 1
}
```

## Como o front deve interpretar os campos

| Campo | Uso no front |
| --- | --- |
| `mapa_talentos` | Lista de pontos para exibir no mapa ou lista lateral. |
| `regiao` | Nome do candidato. O nome vem de `usuario.nome`. |
| `lat` | Latitude do candidato. |
| `lon` | Longitude do candidato. |
| `concentracao` | Valor fixo `1` por candidato retornado. |
| `cobertura_rede` | Texto informativo legado. |
| `perfis_disponiveis` | Valor fixo `1` por candidato retornado. |
| `total_regioes` | Quantidade de pontos retornados. |
| `total_candidatos` | Quantidade total de candidatos retornados. |

## Estados de tela sugeridos

| Situacao | Comportamento no front |
| --- | --- |
| Sem vaga selecionada | Mostrar mensagem para selecionar uma vaga. |
| Carregando vagas | Mostrar loading no seletor de vagas. |
| Carregando insights | Mostrar loading no mapa/lista. |
| `mapa_talentos` vazio | Mostrar "Nenhum candidato compativel encontrado para esta vaga." |
| Erro `401` | Token ausente ou expirado; redirecionar para login. |
| Erro `403` | A vaga nao pertence a empresa logada. |
| Erro `404` | Vaga nao encontrada. |

## Exemplo de uso na tela

```ts
const [vagas, setVagas] = useState([]);
const [vagaSelecionadaId, setVagaSelecionadaId] = useState('');
const [insights, setInsights] = useState(null);

async function carregarVagas() {
  const response = await fetch(`${API_URL}/vagas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setVagas(await response.json());
}

async function selecionarVaga(vagaId: string) {
  setVagaSelecionadaId(vagaId);

  const data = await buscarInsightsDaVaga(vagaId, token);

  setInsights(data);
}
```

## Observacao importante

O endpoint sem `vagaId` continua funcionando:

```http
GET /insights
```

Mas para a tela nova do front, use sempre:

```http
GET /insights?vagaId=ID_DA_VAGA
```

Isso garante que os insights exibidos sejam da vaga escolhida pela empresa.
