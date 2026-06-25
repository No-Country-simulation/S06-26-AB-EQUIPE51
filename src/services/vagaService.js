///vagaService.js

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

// GET /vagas/:id — busca uma vaga pelo id
// Usado para preencher tela de edição ou exibir detalhes
export async function buscarVaga(id) {
  const response = await api.get(`/vagas/${id}`)
  return response.data
}

// PUT /vagas/:id — atualiza os dados da vaga
// Campos editáveis: titulo, nivel, regiao, skills, etc
export async function atualizarVaga(id, dados) {
  const response = await api.put(`/vagas/${id}`, dados)
  return response.data
}

// DELETE /vagas/:id — remove a vaga
// ⚠️ Confirma com o backend se isso é remoção real (hard delete)
// ou se segue o mesmo padrão de empresaService (ativo: false).
export async function removerVaga(id) {
  const response = await api.delete(`/vagas/${id}`)
  return response.data
}

// PATCH /vagas/:id/arquivar — arquiva a vaga (não aparece mais nas listagens ativas)
// ⚠️ Rota e verbo HTTP ainda não confirmados com o backend —
// segui o padrão REST mais comum, mas vale validar antes de usar em produção.
export async function arquivarVaga(id) {
  const response = await api.patch(`/vagas/${id}/arquivar`)
  return response.data
}

// PATCH /vagas/:id/status — ativa ou desativa a vaga
// ⚠️ Mesma observação acima: rota provisória até confirmação do backend.
export async function alterarStatusVaga(id, ativo) {
  const response = await api.patch(`/vagas/${id}/status`, { ativo })
  return response.data
}

// GET /vagas?empresaId=:id — lista apenas as vagas da empresa logada
// ⚠️ Forma de filtrar (query param vs rota própria como /empresas/:id/vagas)
// ainda não confirmada. Usei query param por ser o padrão mais comum,
// mas pode ser que o backend já filtre automaticamente pelo token
// (sem precisar passar nada, já que /empresas/me existe segundo o
// documento de requisitos V2).
export async function listarVagasDaEmpresa(empresaId) {
  const response = await api.get('/vagas', { params: { empresaId } })
  return response.data
}