// MatchIA.jsx
import { useState } from 'react'
import styles from '../../styles/matchIA.module.css'

// dados mock — troque pela API real (matchService) quando estiver pronta
const METRICAS = [
  { label: 'Compatibilidade média', valor: '0%', desc: 'dos melhores matches' },
  { label: 'Candidatos encontrados', valor: 0, desc: 'após os filtros aplicados' },
  { label: 'Alta compatibilidade', valor: 0, desc: 'acima de 80% de match' },
  { label: 'Diversidade no resultado', valor: '0%', desc: 'resultado agregado do backend' },
]

const CRITERIOS = [
  { label: 'Skills obrigatórias', valor: 'Nenhuma skill' },
  { label: 'Nível', valor: 'PLENO' },
  { label: 'Região', valor: 'Não informada' },
  { label: 'Diversidade mínima', valor: '40%' },
]

export default function MatchIA() {
  const [abaAtiva, setAbaAtiva] = useState('melhores')
  const temMatches = false // troque por matches.length > 0 quando vier da API
  const vagaSelecionada = null // troque pelo objeto da vaga quando vier da API

  return (
    <div className={styles.pagina}>

      {/* Cabeçalho */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.titulo}>Match com IA</h1>
          <p className={styles.subtitulo}>Resultado inteligente com base na compatibilidade de skills, experiência e alinhamento cultural.</p>
        </div>
        <button className={styles.btnOpcoes}>Opções ▾</button>
      </header>

      <div className={styles.conteudo}>

        <div className={styles.colunaPrincipal}>

          {/* Aviso de relatório não gerado */}
          {!temMatches && (
            <div className={styles.avisoRelatorio}>
              📄 <strong>Relatório ainda não gerado</strong>
              <p>Volte ao Dashboard, ajuste os campos da vaga e clique em <strong>GERAR MATCH</strong>. Depois o relatório aparece aqui com dados da API.</p>
            </div>
          )}

          {/* Métricas */}
          <section className={styles.metricasGrid}>
            {METRICAS.map(m => (
              <div key={m.label} className={styles.metricaCard}>
                <span className={styles.metricaLabel}>{m.label}</span>
                <strong className={styles.metricaValor}>{m.valor}</strong>
                <span className={styles.metricaDesc}>{m.desc}</span>
              </div>
            ))}
          </section>

          {/* Abas */}
          <div className={styles.abasRow}>
            <div className={styles.abas}>
              <button
                className={`${styles.aba} ${abaAtiva === 'melhores' ? styles.abaAtiva : ''}`}
                onClick={() => setAbaAtiva('melhores')}
              >
                Melhores Matches
              </button>
              <button
                className={`${styles.aba} ${abaAtiva === 'avaliacao' ? styles.abaAtiva : ''}`}
                onClick={() => setAbaAtiva('avaliacao')}
              >
                Aguardando Avaliação
              </button>
            </div>
            <button className={styles.btnFiltros}>⚙ Filtros</button>
          </div>

          {/* Aviso LGPD */}
          <div className={styles.avisoLgpd}>
            Observação LGPD: dados pessoais dos candidatos são minimizados. A empresa visualiza nome, skills e score de compatibilidade necessários para a etapa de match.
          </div>

          {/* Estado vazio / lista de matches */}
          {!temMatches ? (
            <div className={styles.semMatch}>
              <strong className={styles.semMatchTitulo}>Nenhum match gerado</strong>
              <p className={styles.semMatchTexto}>
                Execute um match para visualizar apenas perfis anonimizados retornados pelo backend para a empresa logada.
              </p>
            </div>
          ) : (
            <div className={styles.listaMatches}>
              {/* aqui entra o .map dos candidatos retornados pela API */}
            </div>
          )}

        </div>

        {/* Coluna direita */}
        <aside className={styles.colunaDireita}>

          <section className={styles.bloco}>
            <div className={styles.blocoHeaderFlex}>
              <h3 className={styles.blocoTitulo}>Vaga selecionada</h3>
              <a href="#" className={styles.linkVerVaga}>Ver vaga</a>
            </div>

            {!vagaSelecionada ? (
              <div className={styles.vagaVaziaRow}>
                <span className={styles.iconeVagaVazia}>📁</span>
                <div>
                  <strong className={styles.vagaVaziaTitulo}>Nenhuma vaga selecionada</strong>
                  <p className={styles.vagaVaziaDesc}>App BiT</p>
                  <p className={styles.vagaVaziaInfo}>Sem região | API protegida</p>
                </div>
              </div>
            ) : (
              <div>{/* dados da vaga selecionada */}</div>
            )}
          </section>

          <section className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Critérios da Vaga</h3>
            {CRITERIOS.map(c => (
              <div key={c.label} className={styles.criterioLinha}>
                <span className={styles.criterioLabel}>{c.label}</span>
                <strong className={styles.criterioValor}>{c.valor}</strong>
              </div>
            ))}
          </section>

          <section className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Resumo do Match com IA</h3>
            <p className={styles.resumoTexto}>
              O backend ranqueia perfis com base em critérios da vaga e retorna dados minimizados para a empresa logada.
            </p>
          </section>

        </aside>
      </div>
    </div>
  )
}