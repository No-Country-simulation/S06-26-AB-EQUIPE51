import api from "./api"
import { buscarEmpresaLogadaId } from "./usuarioLogadoService"

function normalizarLista(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.vagas)) return data.vagas
  if (Array.isArray(data?.data)) return data.data
  return []
}

export async function listarVagas() {
  const empresaId = await buscarEmpresaLogadaId()
  if (!empresaId) return []

  const response = await api.get(`/vagas/empresa/${empresaId}`)
  return normalizarLista(response.data)
}

export async function criarVaga(dados) {
  const response = await api.post("/vagas", dados)
  return response.data
}

export async function buscarVaga(id) {
  const response = await api.get(`/vagas/${id}`)
  return response.data
}

export async function atualizarVaga(id, dados) {
  const response = await api.put(`/vagas/${id}`, dados)
  return response.data
}

export async function removerVaga(id) {
  const response = await api.delete(`/vagas/${id}`)
  return response.data
}

export async function arquivarVaga(id) {
  const response = await api.patch(`/vagas/${id}/arquivar`)
  return response.data
}

export async function alterarStatusVaga(id, ativo) {
  const response = await api.patch(`/vagas/${id}/status`, { ativo })
  return response.data
}

export async function listarVagasDaEmpresa(empresaId) {
  const idEmpresa = empresaId ?? (await buscarEmpresaLogadaId())
  if (!idEmpresa) return []

  const response = await api.get(`/vagas/empresa/${idEmpresa}`)
  return normalizarLista(response.data)
}
