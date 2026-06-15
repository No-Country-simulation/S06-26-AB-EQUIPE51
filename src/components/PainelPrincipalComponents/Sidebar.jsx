import styles from "../../styles/sidebar.module.css"

const NAV_ITEMS = [
  { key: "mapa",          label: "Mapa de Talentos"},
  { key: "vagas",         label: "Vagas"},
  { key: "cadastrarVaga", label: "Cadastrar Vaga"},
  { key: "shortlist",    label: "Candidatos" },
]

export default function Sidebar({ activeView, onNavigate, aberta, onFechar }) {
  return (
    <>
    {/* {menu mobile, no celular ele sai do menu lateral e vai pro menu hamburguer} */}
      {aberta && <div className={styles.overlay} onClick={onFechar} />}

      <aside className={`${styles.sidebar} ${aberta ? styles.sidebarAberta : ""}`}>
        <div className={styles.logo}>
          <strong>InclusiveTech</strong>
          <span>Matching inclusivo com propósito</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => {
                onNavigate(item.key)
                onFechar()
              }}
              className={`${styles.item} ${activeView === item.key ? styles.ativo : ""}`}
            >
              <i className={`ti ${item.icon}`} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.mensagem}>
          <span>🌱 Impacto que transforma</span>
          <p>Conectamos empresas a talentos diversos em todo o Brasil.</p>
          <a href="#">Saiba mais →</a>
        </div>
      </aside>
    </>
  )
}