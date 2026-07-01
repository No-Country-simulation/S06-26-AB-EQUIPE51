// src/services/api.js
//
// Configuração central do Axios. Todas as chamadas de API passam por aqui.
// Implementa os requisitos do documento "Integração Frontend-Backend V2":
// - withCredentials: true (necessário pro cookie HttpOnly do refresh token)
// - interceptor de request: injeta o Authorization Bearer automaticamente
// - interceptor de response: trata 401 com refresh automático (com flag _retry
//   pra não entrar em loop infinito) e padroniza os outros status codes

import axios from "axios"
import { getAccessToken, setAccessToken, logout } from "./authService"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true, // permite o navegador enviar o cookie do refresh token
})

// ── Interceptor de REQUEST ──────────────────────────────────
// Antes de qualquer chamada saber, anexa o token que está em memória.
// Não lemos de localStorage — o token vive só na variável do authService.
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Interceptor de RESPONSE ──────────────────────────────────
// Trata os erros de forma centralizada, conforme a tabela do documento:
// 400 validação, 401 renovar sessão, 403 acesso negado, 404 não encontrado,
// 409 conflito, 429 excesso de tentativas, 500 erro genérico.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    // 401 = token expirado. Tenta renovar UMA vez (flag _retry evita loop infinito
    // se o refresh também falhar e continuar voltando 401 pra sempre)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const novoAccessToken = await refreshSessao()
        setAccessToken(novoAccessToken)

        // repete a requisição original, agora com o token novo
        originalRequest.headers.Authorization = `Bearer ${novoAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // se o refresh falhar, a sessão realmente acabou — desloga e força login
        logout()
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    // Os outros status apenas retornam o erro — cada tela decide a mensagem
    // exibida ao usuário (toast, texto inline, etc), usando error.response.data
    // que normalmente já vem com uma mensagem amigável do backend.
    return Promise.reject(error)
  }
)

// Função auxiliar separada para não criar dependência circular com authService
// (authService importa api, e api precisa chamar refresh — então isolamos
// a chamada de refresh aqui dentro, usando axios puro, sem passar pelos
// interceptors de novo)
async function refreshSessao() {
  const response = await axios.post(
    `${api.defaults.baseURL}/auth/refresh`,
    {},
    { withCredentials: true } // o refresh token vai sozinho, via cookie HttpOnly
  )
  return response.data.access_token
}

export default api