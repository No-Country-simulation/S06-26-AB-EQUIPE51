// RelatorioESG.jsx
import styles from '../../styles/relatorioESG.module.css'

// dados mock — troque pela API real (esgService) quando estiver pronta
const METRICAS = [
  { label: 'Meta de diversidade', valor: '45%', desc: 'configurada no perfil de empresa' },
  { label: 'Meta ESG da empresa', valor: '45%', desc: 'sem expor diversidade individual' },
  { label: 'Alta compatibilidade', valor: 0, desc: 'perfis anonimizados acima de 80%' },
  { label: 'Diversidade no match', valor: '0%', desc: 'resultado agregado do backend' },
  { label: 'Base analisável', valor: 0, desc: '3 vagas ativas no backend' },
]

const GRUPOS_PRIORITARIOS = ['MULHER', 'LGBTQIA+']

export default function RelatorioESG() {
  const matchExecutado = false // troque pela API quando houver match gerado

  return (
    <div className={styles.pagina}>

      {/* Cabeçalho */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.titulo}>Dashboard da Empresa</h1>
          <p className={styles.subtitulo}>Veja apenas dados da empresa logada, vagas e matches autorizados.</p>
        </div>
      </header>

      {/* Faixa Relatório ESG */}
      <div className={styles.faixaEmpresa}>
        <div>
          <strong className={styles.empresaTitulo}>Relatório ESG</strong>
          <p className={styles.empresaDesc}>Indicadores baseados em empresa, vagas, candidatos e último match.</p>
        </div>
        <span className={styles.badgeEmpresa}>InclusiveTech</span>
      </div>

      <div className={styles.conteudo}>

        {/* Aviso de relatório vazio */}
        {!matchExecutado && (
          <div className={styles.avisoAlerta}>
            ⚠️ <strong>Gere um match para popular este relatório</strong>
            <p>O relatório ESG usa o resultado do endpoint <strong>/match</strong>. Sem um match executado, apenas os indicadores gerais ficam visíveis.</p>
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

        {/* Bloco privacidade + grupos prioritários */}
        <div className={styles.duasColunas}>

          <section className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Privacidade dos resultados</h3>
            <p className={styles.privacidadeTexto}>
              O dashboard exibe apenas perfis anonimizados e indicadores agregados autorizados.
              Dados sensíveis individuais não são exibidos para a empresa.
            </p>
          </section>

          <section className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Grupos prioritários</h3>
            <div className={styles.gruposRow}>
              {GRUPOS_PRIORITARIOS.map(grupo => (
                <span key={grupo} className={styles.grupoTag}>{grupo}</span>
              ))}
            </div>
            <p className={styles.gruposTexto}>
              Estes grupos vem do cadastro da empresa e orientam a leitura do indicador de diversidade do match.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}