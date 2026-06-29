// Mapa.jsx
import { useState, useEffect } from 'react'
import { listarVagas } from '../../services/vagaService' // real
import MapaCalor from '../../components/PainelPrincipalComponents/MapaCalor'
import styles from '../../styles/mapa.module.css'

// ⚠️ TEMPORÁRIO — duas vagas fictícias para testar o fluxo sem precisar do backend rodando.
// REMOVER esta constante e o "if (USAR_VAGAS_MOCK)" abaixo quando for testar com a API real.
const VAGAS_MOCK = [
  { id: 'vaga-1', titulo: 'Backend NestJS', nivel: 'Pleno', regiao: 'Florianópolis' },
  { id: 'vaga-2', titulo: 'UX Designer', nivel: 'Júnior', regiao: 'São Paulo' },
]

const USAR_VAGAS_MOCK = true // ⚠️ trocar para false quando for testar com a API de verdade

// ⚠️ TEMPORÁRIO — gera talentos fictícios espalhados perto de Florianópolis,
// associados às vagas mock acima. Remover quando /insights estiver confirmado.
function gerarTalentosMock(vagas) {
  const NOMES = [
    'Rafael Martins', 'Aline Barbosa', 'Lucas Menezes', 'Samira Rodrigues',
    'Natalia Freitas', 'Gabriel Nascimento', 'Vitor Castro', 'Andre Santos',
    'Beatriz Lima', 'Carla Souza',
  ]

  return NOMES.map((nome, i) => ({
    id: i + 1,
    nome,
    latitude: -27.59 + (Math.random() - 0.5) * 0.08,
    longitude: -48.55 + (Math.random() - 0.5) * 0.08,
    vagaId: vagas.length > 0 ? vagas[i % vagas.length].id : null,
  }))
}

export default function Mapa() {
  const [vagas, setVagas] = useState([])
  const [vagaSelecionada, setVagaSelecionada] = useState('')
  const [talentosMock, setTalentosMock] = useState([])
  const [carregandoVagas, setCarregandoVagas] = useState(true)

  useEffect(() => {
    async function buscarVagas() {
      try {
        // ⚠️ TEMPORÁRIO — usa mock se USAR_VAGAS_MOCK for true, senão chama a API real
        const data = USAR_VAGAS_MOCK ? VAGAS_MOCK : await listarVagas()

        setVagas(data)
        setTalentosMock(gerarTalentosMock(data))
        if (data.length > 0) {
          setVagaSelecionada(data[0].id)
        }
      } catch (error) {
        console.error('Erro ao carregar vagas:', error)
      } finally {
        setCarregandoVagas(false)
      }
    }
    buscarVagas()
  }, [])

  const talentosFiltrados = talentosMock.filter(t => t.vagaId === vagaSelecionada)
  const top10 = talentosFiltrados.slice(0, 10)
  const vagaAtual = vagas.find(v => v.id === vagaSelecionada)

  return (
    <div className={styles.pagina}>

      <header className={styles.header}>
        <div>
          <h1 className={styles.titulo}>Mapa de Talentos</h1>
          <p className={styles.subtitulo}>Mapa de calor com a localização dos talentos para a vaga selecionada.</p>
        </div>
        <button className={styles.btnOpcoes}>Opções ▾</button>
      </header>

      <div className={styles.conteudo}>

        <div className={styles.colunaPrincipal}>

          <section className={styles.bloco}>
            <div className={styles.blocoHeader}>
              <div>
                <h3 className={styles.blocoTitulo}>Mapa de Talentos</h3>
                <p className={styles.blocoSubtitulo}>Mapa de calor com a localização dos talentos para a vaga selecionada.</p>
              </div>
              <div className={styles.acoes}>
                <select
                  className={styles.selectCidade}
                  value={vagaSelecionada}
                  onChange={(e) => setVagaSelecionada(e.target.value)}
                  disabled={carregandoVagas}
                >
                  {carregandoVagas && <option>Carregando vagas...</option>}
                  {!carregandoVagas && vagas.length === 0 && <option>Nenhuma vaga cadastrada</option>}
                  {vagas.map(vaga => (
                    <option key={vaga.id} value={vaga.id}>
                      {vaga.titulo} • {vaga.nivel}
                    </option>
                  ))}
                </select>
                <button className={styles.btnFiltros}>⚙ Filtros</button>
              </div>
            </div>

            <div className={styles.mapaPlaceholder}>
              {carregandoVagas && <p className={styles.mensagemCentral}>Carregando...</p>}
              {!carregandoVagas && <MapaCalor pontos={talentosFiltrados} />}
            </div>
          </section>

        </div>

        <aside className={styles.colunaDireita}>

          <section className={styles.bloco}>
            <h3 className={styles.visaoLabel}>Visão Geral</h3>
            <strong className={styles.visaoNumero}>{talentosFiltrados.length}</strong>
            <p className={styles.visaoDesc}>Talentos ativos</p>
            <div className={styles.backendBadge}>
              <strong>{vagaAtual?.titulo ?? 'Nenhuma vaga'}</strong>
              <span>Fonte: vaga selecionada</span>
            </div>
          </section>

          <section className={styles.bloco}>
            <h3 className={styles.usuariosTitulo}>Top 10 talentos</h3>
            <div className={styles.listaUsuarios}>
              {top10.length === 0 && (
                <p className={styles.mensagemCentral}>Nenhum talento para esta vaga.</p>
              )}
              {top10.map((t, i) => (
                <div key={t.id} className={styles.usuarioLinha}>
                  <span className={styles.usuarioNum}>{i + 1}</span>
                  <span className={styles.usuarioDot} />
                  <span className={styles.usuarioNome}>{t.nome}</span>
                  <span className={styles.usuarioQtd}>1</span>
                </div>
              ))}
            </div>
          </section>

        </aside>
      </div>
    </div>
  )
}