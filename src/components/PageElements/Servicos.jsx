import styles from "../../styles/servicos.module.css"

const SERVICOS = [
  {
    icone: "ti-map-pin",
    titulo: "Mapa de Geolocalização",
    descricao: "Visualize onde estão os talentos em todo o Brasil com dados em tempo real por região, cidade e perfil de diversidade.",
  },
  {
    icone: "ti-sparkles",
    titulo: "Match Inclusivo com IA",
    descricao: "Nossa inteligência artificial conecta empresas a candidatos diversos com base em skills, localização e critérios ESG.",
  },
  {
    icone: "ti-shield-check",
    titulo: "Segurança e Transparência",
    descricao: "Plataforma construída sob os princípios da LGPD, com controle de acesso, auditoria e proteção de dados em todas as etapas.",
  },
]

export default function Servicos() {
  return (
    <section className={styles.section}>
      <div className={styles.cabecalho}>
        <h2 className={styles.titulo}>Nossos Serviços</h2>
        <p className={styles.subtitulo}>
          Tecnologia e inclusão juntas para transformar o mercado de trabalho.
        </p>
      </div>

      <div className={styles.grid}>
        {SERVICOS.map(servico => (
          <div key={servico.titulo} className={styles.card}>
            <div className={styles.iconeWrap}>
              <i className={`ti ${servico.icone}`} aria-hidden="true" />
            </div>
            <h3 className={styles.cardTitulo}>{servico.titulo}</h3>
            <p className={styles.cardDescricao}>{servico.descricao}</p>
          </div>
        ))}
      </div>
    </section>
  )
}