import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import styles from "../../styles/sidebar.module.css";
import logo from "../../assets/logo-inclusive-tech.png";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "vagas", label: "Vagas" },
  { key: "MatchIA", label: "Match IA" },
  { key: "esg", label: "Relatórios ESG" },
  { key: "mapa", label: "Mapa de Talentos" },
  { key: "cadastrarVaga", label: "Cadastrar Vaga" },
  { key: "sair", label: "Sair" },
];

export default function Sidebar({ activeView, onNavigate, aberta, onFechar }) {
  const navigate = useNavigate();
  const [confirmandoSaida, setConfirmandoSaida] = useState(false);

  function handleClickItem(key) {
    if (key === "sair") {
      setConfirmandoSaida(true);
      return;
    }

    onNavigate(key);
    onFechar();
  }

  function confirmarSaida() {
    logout();
    setConfirmandoSaida(false);
    onFechar();
    navigate("/login");
  }

  function cancelarSaida() {
    setConfirmandoSaida(false);
  }

  return (
    <>
      {aberta && <div className={styles.overlay} onClick={onFechar} />}

      <aside
        className={`${styles.sidebar} ${aberta ? styles.sidebarAberta : ""}`}
      >
        <img src={logo} className={styles.logo} />

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => handleClickItem(item.key)}
              className={`${styles.item} ${
                activeView === item.key ? styles.ativo : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {confirmandoSaida && (
        <div className={styles.modalOverlay} onClick={cancelarSaida}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>Sair da conta</h3>
            <p className={styles.modalTexto}>Tem certeza que deseja sair?</p>

            <div className={styles.modalAcoes}>
              <button
                className={styles.modalBotaoCancelar}
                onClick={cancelarSaida}
              >
                Cancelar
              </button>
              <button
                className={styles.modalBotaoConfirmar}
                onClick={confirmarSaida}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
