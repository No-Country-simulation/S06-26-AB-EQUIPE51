// Mapa.jsx
import { useState, useEffect } from 'react'
import { buscarInsights } from '../../services/insightsService'
import MapaCalor from '../../components/PainelPrincipalComponents/MapaCalor'
import styles from '../../styles/mapa.module.css'

// ⚠️ TEMPORÁRIO — dados de exemplo só pra visualizar o mapa funcionando.
// Quando o /insights estiver confirmado e funcionando, REMOVER este array
// e trocar USAR_MOCK para false (ou apagar o if abaixo).
const TALENTOS_MOCK = [
  { id: 1, nome: 'Rafael Martins', latitude: -27.5954, longitude: -48.5480, regiao: 'Florianópolis' },
  { id: 2, nome: 'Aline Barbosa', latitude: -27.6100, longitude: -48.5200, regiao: 'Florianópolis' },
  { id: 3, nome: 'Lucas Menezes', latitude: -27.5800, longitude: -48.5600, regiao: 'Florianópolis' },
  { id: 4, nome: 'Samira Rodrigues', latitude: -27.6050, longitude: -48.5350, regiao: 'Florianópolis' },
  { id: 5, nome: 'Natalia Freitas', latitude: -27.5700, longitude: -48.5100, regiao: 'Florianópolis' },
  { id: 6, nome: 'Gabriel Nascimento', latitude: -27.6200, longitude: -48.5450, regiao: 'Florianópolis' },
  { id: 7, nome: 'Vitor Castro', latitude: -27.5900, longitude: -48.5050, regiao: 'Florianópolis' },
]

const USAR_MOCK = true // ⚠️ TROCAR PARA false quando /insights estiver pronto

export default function Mapa() {
  const [talentos, setTalentos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function buscarDados() {
      // ⚠️ BLOCO TEMPORÁRIO — apagar este if junto com TALENTOS_MOCK e USAR_MOCK
      if (USAR_MOCK) {
        setTalentos(TALENTOS_MOCK)
        setCarregando(false)
        return
      }

      try {
        const data = await buscarInsights()
        setTalentos(data)
      } catch (error) {
        setErro('Não foi possível carregar os dados do mapa.')
        console.error(error)
      } finally {
        setCarregando(false)
      }
    }
    buscarDados()
  }, [])

  const top10 = talentos.slice(0, 10)

  return (
    <div className={styles.pagina}>

      <header className={styles.header}>
        <div>
          <h1 className={styles.titulo}>Mapa de Talentos</h1>
          <p className={styles.subtitulo}>Talentos agregados conforme vagas da empresa logada.</p>
        </div>
        <button className={styles.btnOpcoes}>Opções ▾</button>
      </header>

      <div className={styles.conteudo}>

        <div className={styles.colunaPrincipal}>

          <section className={styles.bloco}>
            <div className={styles.blocoHeader}>
              <div>
                <h3 className={styles.blocoTitulo}>Mapa de Talentos</h3>
                <p className={styles.blocoSubtitulo}>Mapa de calor com a localização dos talentos.</p>
              </div>
              <div className={styles.acoes}>
                <select className={styles.selectCidade}>
                  <option>Escopo da empresa logada</option>
                </select>
                <button className={styles.btnFiltros}>⚙ Filtros</button>
              </div>
            </div>

            <div className={styles.mapaPlaceholder}>
              {carregando && <p>Carregando mapa...</p>}
              {!carregando && erro && <p>{erro}</p>}
              {!carregando && !erro && <MapaCalor pontos={talentos} />}
            </div>
          </section>

        </div>

        <aside className={styles.colunaDireita}>

          <section className={styles.bloco}>
            <h3 className={styles.visaoLabel}>Visão Geral</h3>
            <strong className={styles.visaoNumero}>{talentos.length}</strong>
            <p className={styles.visaoDesc}>Talentos ativos</p>
            <div className={styles.backendBadge}>
              <strong>Backend</strong>
              <span>fonte autorizada</span>
            </div>
          </section>

          <section className={styles.bloco}>
            <h3 className={styles.usuariosTitulo}>Top 10 talentos</h3>
            <div className={styles.listaUsuarios}>
              {top10.map((t, i) => (
                <div key={t.id ?? i} className={styles.usuarioLinha}>
                  <span className={styles.usuarioNum}>{i + 1}</span>
                  <span className={styles.usuarioDot} />
                  <span className={styles.usuarioNome}>{t.nome ?? 'Candidato sem nome'}</span>
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