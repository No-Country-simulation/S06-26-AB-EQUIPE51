// Vagas.jsx
import styles from '../../styles/vagas.module.css'

// dados mock — troque pela chamada real ao backend (listarVagas) quando estiver pronta
const VAGAS = [
  { titulo: 'ANALISTA DE DADOS', nivel: 'JUNIOR', regiao: 'FLORIANOPOLIS', skills: ['SQL'], status: 'Ativo' },
  { titulo: 'Analista de Dados', nivel: 'PLENO', regiao: 'Florianopolis', skills: ['Python', 'SQL', 'Power BI'], status: 'Ativo' },
  { titulo: 'UX Designer', nivel: 'JUNIOR', regiao: 'São Paulo', skills: ['Figma', 'UX Research', 'Design System'], status: 'Ativo' },
]

export default function Vagas() {
  return (
    <div className={styles.pagina}>

      {/* Cabeçalho */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.titulo}>Vagas da Empresa</h1>
          <p className={styles.subtitulo}>Acompanhe as vagas cadastradas e publique novas oportunidades.</p>
        </div>
        <button className={styles.btnOpcoes}>Opções ▾</button>
      </header>

      {/* Faixa de identificação da empresa */}
      <div className={styles.faixaEmpresa}>
        <div>
          <strong className={styles.empresaTitulo}>Vagas Empresa</strong>
          <p className={styles.empresaNome}>Inova Brasil</p>
        </div>
        <div className={styles.acoesEmpresa}>
          <button className={styles.btnAbrir}>📂 Abrir</button>
          <button className={styles.btnAdicionar}>+ Adicionar nova vaga</button>
        </div>
      </div>

      {/* Lista de vagas */}
      <section className={styles.bloco}>
        <div className={styles.blocoHeader}>
          <h3 className={styles.blocoTitulo}>Todas as vagas</h3>
          <span className={styles.badgeContagem}>{VAGAS.length} cadastradas</span>
        </div>

        <div className={styles.grid}>
          {VAGAS.map(vaga => (
            <div key={vaga.titulo} className={styles.vagaCard}>
              <div className={styles.vagaTopo}>
                <strong className={styles.vagaTitulo}>{vaga.titulo}</strong>
                <span className={styles.statusBadge}>{vaga.status}</span>
              </div>
              <p className={styles.vagaInfo}>{vaga.regiao} | {vaga.nivel}</p>
              <div className={styles.skillsRow}>
                {vaga.skills.map(skill => (
                  <span key={skill} className={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Aviso de rodapé */}
      <div className={styles.avisoRodape}>
        ⓘ Conectado como Inova Brasil. Rotas protegidas e mapa agregado ativos.
      </div>

    </div>
  )
}