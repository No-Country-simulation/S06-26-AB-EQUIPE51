import { useNavigate } from "react-router-dom"
import { logout } from "../../services/authService"
import styles from "../../styles/sidebar.module.css"

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "vagas", label: "Vagas" },
  { key: "MatchIA", label: "Match IA" },
  { key: "esg", label: "Relatórios ESG" },
  { key: "mapa", label: "Mapa de Talentos" },
  { key: "cadastrarVaga", label: "Cadastrar Vaga" },
  { key: "sair", label: "Sair" },
]

export default function Sidebar({ activeView, onNavigate, aberta, onFechar }) {
  const navigate = useNavigate()

  function handleClickItem(key) {
    if (key === "sair") {
      logout()
      onFechar()
      navigate("/login")
      return
    }

    onNavigate(key)
    onFechar()
  }

  return (
    <>
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
              onClick={() => handleClickItem(item.key)}
              className={`${styles.item} ${activeView === item.key ? styles.ativo : ""}`}
            >
              <i className={`ti ${item.icon}`} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}