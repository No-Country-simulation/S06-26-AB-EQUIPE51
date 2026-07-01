// src/services/empresaService.js
//
// Todas as chamadas de API relacionadas a Empresas ficam AQUI.
// Os componentes/páginas chamam essas funções — nunca o axios diretamente.
// Isso deixa o código do formulário limpo e fácil de testar.
import api from './api';

//Post /empresas - cria uma nova empresa
export async function criarEmpresa(dados) {
  const response = await api.post('/empresas', dados)
  return response.data
}

// GET /empresas — lista todas as empresas
export async function listarEmpresas() {
  const response = await api.get('/empresas')
  return response.data
}
 
// GET /empresas/:id — busca uma empresa pelo id (usado para preencher tela de edição)
export async function buscarEmpresa(id) {
  const response = await api.get(`/empresas/${id}`)
  return response.data
}
 
// PUT /empresas/:id — atualiza dados da empresa
export async function atualizarEmpresa(id, dados) {
  const response = await api.put(`/empresas/${id}`, dados)
  return response.data
}
 
// DELETE /empresas/:id — desativa a empresa (não apaga do banco)
export async function removerEmpresa(id) {
  const response = await api.delete(`/empresas/${id}`)
  return response.data
}