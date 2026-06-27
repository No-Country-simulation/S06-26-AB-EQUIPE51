# Acesso da API IA ao Backend

A API IA deve acessar o backend usando um token interno enviado no header da requisicao.

## Endpoint

```http
POST /match
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

## Observacoes

- O token interno e exclusivo para comunicacao entre a API IA e o backend.
- O token nao deve ser enviado para o frontend.
- O token nao deve ser salvo em repositorio.
- O usuario comum continua acessando a mesma rota com o JWT normal do login.
- Se o token interno vazar, gere outro valor e atualize os ambientes.
