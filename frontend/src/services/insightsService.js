// src/services/insightsService.js

import api from './api'

// GET /insights — retorna dados básicos para o mapa de talentos
// ⚠️ Formato exato do retorno ainda não confirmado com o backend.
// export async function buscarInsights() {
//   const response = await api.get('/insights')
//   return response.data
// }

//API SUBSTITUTA - ARRUMAR DEPOIS

// src/services/insightsService.js
//
// GET /insights — retorna dados agregados de localização dos talentos
// para o Mapa de Talentos.
//
// AJUSTAR: formato abaixo é uma suposição. Exemplo assumido de retorno:
// [
//   { id: "uuid", nome: "Rafael Martins", latitude: -27.59, longitude: -48.54, regiao: "Florianópolis", grupoDiversidade: "PCD" },
//   ...
// ]



// GET /insights — ⚠️ ainda não confirmado com o backend.
// Quando a doc chegar, ESTA função passa a ser usada de verdade.
// Hipótese de uso: buscarInsights(vagaId) → GET /insights?vagaId=xxx
export async function buscarInsights(vagaId) {
  const response = await api.get('/insights', { params: { vagaId } })
  return response.data
}