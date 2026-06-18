import api from "./api"

//Função basica

//get - listar o candidato

//get - buscar o id do candidato 

//post - candidato 

//PUT - atualizar o id

//DELETE - remover o candidato

// src/services/candidatoService.js
//
// Todas as chamadas de API relacionadas a Candidatos ficam AQUI.
// Os componentes/páginas chamam essas funções — nunca o axios diretamente.
// Campos de IA (latitude, longitude, ageGroup, etc.) são opcionais —
// só envie se o seu formulário coletar esses dados.

import api from './api'

// ─────────────────────────────────────────────
// POST /candidatos — cria um novo candidato
// Campos obrigatórios: skills, nivel, regiao
// Campos opcionais:    grupoDiversidade, latitude, longitude,
//                      ageGroup, incomeCluster, mobilityPattern
// ─────────────────────────────────────────────
export async function criarCandidato(dados) {
  const response = await api.post('/candidatos', dados)
  return response.data
}

// ─────────────────────────────────────────────
// GET /candidatos — lista todos os candidatos
// Retorna array com os candidatos ativos
// ─────────────────────────────────────────────
export async function listarCandidatos() {
  const response = await api.get('/candidatos')
  return response.data
}

// ─────────────────────────────────────────────
// GET /candidatos/:id — busca um candidato pelo id
// Usado para preencher tela de edição ou exibir perfil
// ─────────────────────────────────────────────
export async function buscarCandidato(id) {
  const response = await api.get(`/candidatos/${id}`)
  return response.data
}

// ─────────────────────────────────────────────
// PUT /candidatos/:id — atualiza dados do candidato
// Campos editáveis: skills, nivel, regiao,
//                   grupoDiversidade, latitude, longitude,
//                   ageGroup, incomeCluster, mobilityPattern
// ─────────────────────────────────────────────
export async function atualizarCandidato(id, dados) {
  const response = await api.put(`/candidatos/${id}`, dados)
  return response.data
}

// ─────────────────────────────────────────────
// DELETE /candidatos/:id — desativa o candidato
// Não apaga do banco — apenas marca ativo: false
// ─────────────────────────────────────────────
export async function removerCandidato(id) {
  const response = await api.delete(`/candidatos/${id}`)
  return response.data
}