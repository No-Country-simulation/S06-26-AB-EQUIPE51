import { useState, useEffect } from 'react'
import { listarVagas } from '../../services/vagaService' // real
import { buscarInsights } from "../../services/insightsService";
import { 
  getUltimoMatch,
  setUltimoMatch, 
} from "../../services/matchStore";
import MapaCalor from '../../components/PainelPrincipalComponents/MapaCalor'
import { executarMatchPorVaga } from "../../services/matchIA";
import { buscarEmpresaLogadaId } from "../../services/usuarioLogadoService";
import styles from '../../styles/mapa.module.css'


const COORDENADAS_BASE = [
  [-27.5954, -48.5480],
  [-27.5901, -48.5523],
  [-27.6037, -48.5371],
  [-27.5812, -48.5650],
  [-27.6120, -48.5308],
  [-27.5746, -48.5414],
  [-27.6011, -48.5587],
  [-27.5864, -48.5262],
  [-27.6202, -48.5488],
  [-27.5688, -48.1000],
]

function gerarTalentosMock(vagas) {
  return vagas.flatMap((vaga, vagaIndex) =>
    COORDENADAS_BASE.map(([latitude, longitude], index) => ({
      id: `${vaga.id}-talento-${index}`,
      vagaId: vaga.id,
      nome: `Talento ${index + 1}`,
      latitude: latitude + vagaIndex * 0.006,
      longitude: longitude - vagaIndex * 0.006,
    }))
  )
}

export default function Mapa() {
  const [vagas, setVagas] = useState([])
  const [vagaSelecionada, setVagaSelecionada] = useState('')
  const [talentosMock, setTalentosMock] = useState([])
  const [talentosMapa, setTalentosMapa] = useState([]);
  const [carregandoVagas, setCarregandoVagas] = useState(true)
  const ultimoMatch = getUltimoMatch();
  const [match, setMatch] = useState(getUltimoMatch());
  const candidatosMatch = match?.candidatos ?? [];

  //console.log("MATCH:", candidatosMatch);


  const candidatosComCoordenadas = talentosMapa.filter((ponto) =>
    candidatosMatch.some(
      (candidato) => candidato.nome === ponto.regiao
    )
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMatch(getUltimoMatch());
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function buscarVagas() {
      try {
        const data = await listarVagas() // ← agora centralizado no service
        setVagas(data)
        setTalentosMock(gerarTalentosMock(data)) // ainda aqui, mas só os talentos
        if (data.length > 0) setVagaSelecionada(data[0].id)
      } catch (error) {
        console.error('Erro ao carregar vagas:', error)
      } finally {
        setCarregandoVagas(false)
      }
    }
    buscarVagas()
  }, [])
  

  const talentosFiltrados = talentosMock.filter(t => t.vagaId === vagaSelecionada)
  const top10 = candidatosMatch.slice(0,10);
  const vagaAtual = vagas.find(v => v.id === vagaSelecionada)

  async function gerarMatchDaVaga(vagaId) {
    try {
      const vaga = vagas.find((v) => v.id === vagaId);

      if (!vaga) return;

      const empresaId = await buscarEmpresaLogadaId();

      if (!empresaId) return;

      const resposta = await executarMatchPorVaga({
        empresaId,
        vaga,
        filtros: {},
      });

      setUltimoMatch(resposta);

      //console.log("NOVO MATCH:", resposta);

    } catch (erro) {
      console.error("Erro ao gerar match:", erro);
    }
  }

  useEffect(() => {
    async function carregarInsights() {
      try {
        const data = await buscarInsights();

        //console.log("INSIGHTS MAPA:", data);

        setTalentosMapa(data.mapa_talentos || []);
      } catch (erro) {
        console.error("Erro ao buscar insights:", erro);
      }
    }

    carregarInsights();
  }, []);


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
                  onChange={async (e) => {
                    const novaVagaId = e.target.value;
                    setVagaSelecionada(novaVagaId);
                    await gerarMatchDaVaga(novaVagaId);
                  }}
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
              {!carregandoVagas && <MapaCalor pontos={candidatosComCoordenadas.map((c) => ({
                 latitude: c.lat,
                 longitude: c.lon,
                 nome: c.regiao,
              }))}
              />}
            </div>
          </section>

        </div>

        <aside className={styles.colunaDireita}>

          <section className={styles.bloco}>
            <h3 className={styles.visaoLabel}>Visão Geral</h3>
            <strong className={styles.visaoNumero}>{candidatosComCoordenadas.length}</strong>
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
