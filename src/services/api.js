// src/services/api.js
//
// Aqui fica a configuração CENTRAL do axios.
// Todos os outros services importam essa instância — nunca o axios direto.
// Benefício: se a baseURL ou um header mudar, você muda EM UM SÓ LUGAR.

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de resposta: trata erros globalmente.
// Se a API retornar 4xx ou 5xx, o erro cai aqui antes de chegar no seu componente.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || 'Algo deu errado. Tente novamente.'
    return Promise.reject(new Error(message))
  }
)

export default api