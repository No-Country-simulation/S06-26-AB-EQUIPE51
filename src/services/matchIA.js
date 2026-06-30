import api from "./api"

export class MatchService {
  static montarPayload({ empresaId, vaga, filtros = {} }) {
    return {
      empresa_id: empresaId,
      vaga: {
        titulo: vaga?.titulo,
        cargo: vaga?.cargo,
        modalidade: vaga?.modalidade,
        skills: Array.isArray(vaga?.skills) ? vaga.skills : [],
        nivel: vaga?.nivel,
        regiao: vaga?.regiao,
      },
      filtros,
    }
  }

  static async executar(payload) {
    const response = await api.post("/match", payload)
    return response.data
  }

  static async executarPorVaga({ empresaId, vaga, filtros }) {
    const payload = MatchService.montarPayload({ empresaId, vaga, filtros })
    return MatchService.executar(payload)
  }
}

export function montarPayloadMatch(params) {
  return MatchService.montarPayload(params)
}

export async function executarMatch(payload) {
  return MatchService.executar(payload)
}

export async function executarMatchPorVaga(params) {
  return MatchService.executarPorVaga(params)
}
