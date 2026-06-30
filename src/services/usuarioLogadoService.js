import api from "./api"

export async function buscarUsuarioLogado() {
  const response = await api.get("/auth/me/")
  return response.data
}

export async function buscarEmpresaLogada() {
  const usuario = await buscarUsuarioLogado()
  return usuario?.empresa ?? null
}

export async function buscarEmpresaLogadaId() {
  const empresa = await buscarEmpresaLogada()
  return empresa?.id ?? null
}
