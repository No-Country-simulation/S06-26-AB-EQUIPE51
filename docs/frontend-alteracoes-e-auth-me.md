# Alteracoes no front e uso do /auth/me/

## O que foi alterado

- O projeto passou a usar React no lugar de Preact, porque o codigo ja estava
  escrito com imports de React.
- O Vite foi ajustado para usar `@vitejs/plugin-react`.
- Foi corrigido um loop de autenticacao que acontecia quando `/auth/refresh`
  retornava erro.
- Foi criado `src/services/tokenStore.js` para guardar o access token em
  memoria.
- Foi criado `src/services/usuarioLogadoService.js` para centralizar chamadas
  ao `/auth/me/`.
- O mock de vagas foi removido.
- A tela de vagas agora busca dados reais do backend.
- A tela de vagas agora mostra o nome da empresa logada vindo de `/auth/me/`.
- A listagem de vagas agora usa o id da empresa logada para buscar apenas as
  vagas daquela empresa.

## Por que usar /auth/me/

O endpoint `/auth/me/` retorna os dados do usuario logado e tambem os dados da
empresa ligada a esse usuario.

Exemplo de resposta:

```json
{
  "id": "usuario-empresa-tech-diversity",
  "nome": "Ana Souza",
  "email": "ana@techdiversity.com",
  "role": "EMPRESA",
  "empresa": {
    "id": "empresa-tech-diversity",
    "nomeEmpresa": "Tech Diversity"
  }
}
```

O campo mais importante para filtros e buscas da empresa logada e:

```js
response.data.empresa.id
```

No exemplo acima, o id e:

```txt
empresa-tech-diversity
```

## Exemplo: buscar vagas da empresa logada

Primeiro use o service compartilhado:

```js
import { buscarEmpresaLogadaId } from "./usuarioLogadoService"
```

Depois use esse id para consultar as vagas da empresa:

```js
export async function listarVagas() {
  const empresaId = await buscarEmpresaLogadaId()

  if (!empresaId) {
    return []
  }

  const response = await api.get(`/vagas/empresa/${empresaId}`)
  return response.data
}
```

Com o usuario do exemplo, a chamada final fica:

```http
GET /vagas/empresa/empresa-tech-diversity
Authorization: Bearer <access_token>
```

## Regra para filtros de pesquisa

Sempre que uma tela precisar filtrar dados da empresa logada, siga este fluxo:

1. Importar uma funcao de `usuarioLogadoService.js`.
2. Pegar `empresa.id`.
3. Usar esse id na rota ou filtro da busca.

Exemplo generico:

```js
import { buscarEmpresaLogadaId } from "../services/usuarioLogadoService"

const empresaId = await buscarEmpresaLogadaId()

const resultado = await api.get(`/alguma-rota/empresa/${empresaId}`)
```

Evite usar uma rota geral, como `/vagas/`, em telas que devem mostrar apenas
dados da empresa logada, porque ela pode retornar dados de outras empresas.
