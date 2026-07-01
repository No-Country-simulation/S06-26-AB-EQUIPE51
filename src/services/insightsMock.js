// ⚠️ ARQUIVO TEMPORÁRIO — dados fictícios para popular o Mapa de Talentos
// enquanto o /insights real não está confirmado.
// Quando a doc chegar, este arquivo pode ser deletado e o import
// trocado por insightsService.buscarInsights(vagaId) no Mapa.jsx.

const TODOS_TALENTOS = [
  { id: 1, nome: 'Rafael Martins', latitude: -27.5954, longitude: -48.5480, vagaId: 'vaga-1' },
  { id: 2, nome: 'Aline Barbosa', latitude: -27.6100, longitude: -48.5200, vagaId: 'vaga-1' },
  { id: 3, nome: 'Lucas Menezes', latitude: -27.5800, longitude: -48.5600, vagaId: 'vaga-2' },
  { id: 4, nome: 'Samira Rodrigues', latitude: -27.6050, longitude: -48.5350, vagaId: 'vaga-1' },
  { id: 5, nome: 'Natalia Freitas', latitude: -27.5700, longitude: -48.5100, vagaId: 'vaga-2' },
  { id: 6, nome: 'Gabriel Nascimento', latitude: -27.6200, longitude: -48.5450, vagaId: 'vaga-1' },
  { id: 7, nome: 'Vitor Castro', latitude: -27.5900, longitude: -48.5050, vagaId: 'vaga-2' },
]

// simula a filtragem que o backend faria por vagaId
export function buscarInsightsMock(vagaId) {
  if (!vagaId) return []
  return TODOS_TALENTOS.filter(t => t.vagaId === vagaId)
}