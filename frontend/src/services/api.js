import axios from "axios"
import { getAccessToken, limparAccessToken, setAccessToken } from "./tokenStore"

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://app-bit-backend-production.up.railway.app",
  withCredentials: true, // permite o navegador enviar o cookie do refresh token
})

// ── Interceptor de REQUEST ──────────────────────────────────

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Interceptor de RESPONSE ──────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const url = originalRequest?.url ?? ""
    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/logout")

    if (isAuthEndpoint) {
      return Promise.reject(error)
    }

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
        limparAccessToken()
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
