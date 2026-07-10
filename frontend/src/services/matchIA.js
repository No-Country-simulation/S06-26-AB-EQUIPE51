import api from "./api"

const ULTIMO_MATCH_KEY = "inclusive-tech:ultimo-match"

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
    MatchService.salvarUltimoMatch({
      payload,
      resposta: response.data,
    })
    return response.data
  }

  static async executarPorVaga({ empresaId, vaga, filtros }) {
    const payload = MatchService.montarPayload({ empresaId, vaga, filtros })
    return MatchService.executar(payload)
  }

  static salvarUltimoMatch(data) {
    localStorage.setItem(ULTIMO_MATCH_KEY, JSON.stringify(data))
  }

  static obterUltimoMatch() {
    const data = localStorage.getItem(ULTIMO_MATCH_KEY)
    if (!data) return null

    try {
      return JSON.parse(data)
    } catch {
      return null
    }
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

export function obterUltimoMatch() {
  return MatchService.obterUltimoMatch()
}
