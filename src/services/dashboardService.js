//faz uma chamada GET para a API e devolve os dados


import api from './api'

export async function buscarUltimosRegistros() {
  const response = await api.get('/dashboard/ultimos-registros')
  return response.data
}