// src/services/insightsService.js

import api from './api'

// GET /insights — retorna dados básicos para o mapa de talentos
// ⚠️ Formato exato do retorno ainda não confirmado com o backend.
export async function buscarInsights() {
  const response = await api.get('/insights')
  return response.data
}