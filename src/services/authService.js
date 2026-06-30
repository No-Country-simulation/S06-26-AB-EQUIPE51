// src/services/authService.js
//
// Gerencia login, logout e o access token.
// IMPORTANTE: o access token NUNCA vai para localStorage/sessionStorage.
// Ele fica só em uma variável JS em memória — se a página recarregar,
// ele se perde, e por isso o app deve chamar /auth/refresh ao iniciar
// (o refresh token mora num cookie HttpOnly que o backend seta,
// o JS nem consegue ler ele diretamente).

import api from "./api"
import { limparAccessToken, setAccessToken } from "./tokenStore"

// ── Token em memória ─────────────────────────────────────────
// Variável "privada" do módulo. Não exportamos ela direto, só
// as funções de get/set, pra controlar quem pode alterar.

// ── POST /auth/login ─────────────────────────────────────────
// O backend retorna o access token no corpo da resposta e seta
// o refresh token como cookie HttpOnly automaticamente (por isso
// não precisamos — e não devemos — lidar com ele aqui).
export async function login(dados) {
  const response = await api.post("/auth/login", dados)

  const { access_token } = response.data
  setAccessToken(access_token)

  return response.data
}

// ── POST /auth/refresh ────────────────────────────────────────
// Usado em dois momentos:
// 1. Ao iniciar o app, pra saber se já existe uma sessão válida
// 2. Automaticamente pelo interceptor do api.js, quando um 401 acontece
// Não precisamos mandar nada no body — o refresh token vai sozinho
// via cookie, graças ao withCredentials: true.
export async function refresh() {
  const response = await api.post("/auth/refresh")

  const { access_token } = response.data
  setAccessToken(access_token)

  return response.data
}

// ── POST /auth/logout ────────────────────────────────────────
// Avisa o backend para invalidar o refresh token no servidor
// (importante: só limpar o token no front não basta, porque o
// cookie ainda seria válido se alguém o reaproveitasse).
export async function logout() {
  try {
    await api.post("/auth/logout")
  } catch (error) {
    // mesmo se a chamada falhar (ex: backend fora do ar),
    // ainda limpamos o estado local pra não deixar o usuário travado
    console.error("Erro ao deslogar no servidor:", error)
  } finally {
    limparAccessToken()
  }
}
