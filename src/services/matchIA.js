import api from "./api"

//exibir na tela 
// src/services/matchService.js

import api from './api'

// POST /match — executa matching entre vaga e candidatos
// ⚠️ Os campos do body ainda não foram confirmados com o backend.
// Preencha aqui assim que tiver a doc completa (provavelmente vagaId
// e algum critério de filtro, com base na entidade Candidato que você
// me mandou antes: skills, nivel, regiao, grupoDiversidade etc.)
export async function executarMatch(dados) {
  const response = await api.post('/match', dados)
  return response.data
}

//esperando douglas