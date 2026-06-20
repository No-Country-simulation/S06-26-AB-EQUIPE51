import { useState, useEffect } from "react";
import Sidebar from "../components/PainelPrincipalComponents/Sidebar";
import Mapa from "../components/PainelPrincipalComponents/Mapa";
import Vagas from "../components/PainelPrincipalComponents/Vagas";
import Shortlist from "../components/PainelPrincipalComponents/MatchIA";
import CadastroVaga from "../components/CadastroVaga";
import styles from "../styles/painelPrincipal.module.css";
import Dashboard from "../components/PainelPrincipalComponents/Dasboard";
import RelatorioESG from "../components/PainelPrincipalComponents/RelatórioESG";

export default function PainelPrincipal() {
  const [activeView, setActiveView] = useState("mapa"); // vai começar sempre no mapa no primeiro carregamento da página
  const [dadosVindosDaIA, setDadosVindosDaIA] = useState([]);
  const [menuAberto, setMenuAberto] = useState(false);

  // busca os dados da IA uma vez ao montar
  useEffect(() => {
    async function buscarDadosIA() {
      try {
        const res = await fetch("/api/ia/shortlist");
        const data = await res.json();
        setDadosVindosDaIA(data);
      } catch (err) {
        console.error("Erro ao buscar dados da IA:", err);
      }
    }
    buscarDadosIA(); // função aqui, não sei se será necessário mudar depois
  }, []);

  //Switch dos components que aparecem no dashboard (Painel principal) o nome é referente as Keys que estão no nav
  const views = {
    mapa: <Mapa />,
    vagas: <Vagas />,
    dashboard: <Dashboard />,

    //Aqui pegaria da IA ou banco de dados, não sei como ficou acertado
    MatchIA: <Shortlist candidatos={dadosVindosDaIA} />,
    esg: <RelatorioESG />,
    cadastrarVaga: <CadastroVaga />,
  };

  return (
    <div className={styles.layout}>
      {/* header mobile com hamburguer — invisível no desktop */}
      <div className={styles.menuHamburguer}>
        <strong>InclusiveTech</strong>
        <button
          className={styles.btnHamburguer}
          onClick={() => setMenuAberto(true)}
          aria-label="Abrir menu"
        >
          <i className="ti ti-menu-2" aria-hidden="true" />
        </button>
      </div>

      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        aberta={menuAberto}
        onFechar={() => setMenuAberto(false)}
      />

      <main className={styles.main}>{views[activeView]}</main>
    </div>
  );
}
