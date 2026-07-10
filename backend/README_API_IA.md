# Acesso da API IA ao Backend

A API IA deve acessar o backend usando um token interno enviado no header da requisicao.

## Endpoints liberados

```http
POST /match
GET /candidatos
GET /candidatos/:id
GET /vagas
GET /vagas/empresa/:empresaId
GET /vagas/:id
```

## Headers

```http
Authorization: Bearer <IA_INTERNAL_TOKEN>
Content-Type: application/json
```

O valor de `IA_INTERNAL_TOKEN` deve estar configurado no `.env` do backend e tambem no `.env` da API IA.

## Exemplo de chamada

```js
await fetch(`${BACKEND_URL}/match`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${IA_INTERNAL_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(dados),
});
```

Exemplo de chamada GET:

```js
await fetch(`${BACKEND_URL}/candidatos`, {
  headers: {
    Authorization: `Bearer ${IA_INTERNAL_TOKEN}`,
  },
});
```

## Observacoes

- O token interno e exclusivo para comunicacao entre a API IA e o backend.
- O token nao deve ser enviado para o frontend.
- O token nao deve ser salvo em repositorio.
- O usuario comum continua acessando a mesma rota com o JWT normal do login.
- A rota `GET /candidatos/me` depende de um usuario candidato logado e nao deve ser usada pela integracao IA.
- Se o token interno vazar, gere outro valor e atualize os ambientes.
