// src/services/vagaService.js

import api from './api'

// POST /vagas — cria uma nova vaga
export async function criarVaga(dados) {
  const response = await api.post('/vagas', dados)
  return response.data
}

// GET /vagas — lista todas as vagas
export async function listarVagas() {
  const response = await api.get('/vagas')
  return response.data
}