// Vagas.jsx
import { useState, useEffect } from "react";
import { listarVagas } from "../../services/vagaService";
import styles from "../../styles/vagas.module.css";
import { Link } from "react-router-dom";

export default function Vagas() {
  const [vagas, setVagas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function buscarVagas() {
      try {
        const data = await listarVagas();

        console.log("Resposta da API:", data);
        console.log("É um array?", Array.isArray(data));
        setVagas(data);
      } catch (error) {
        setErro("Não foi possível carregar as vagas.");
        console.error(error);
      } finally {
        setCarregando(false);
      }
    }
    buscarVagas();
  }, []);

  return (
    <div className={styles.pagina}>
      {/* Cabeçalho */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.titulo}>Vagas da Empresa</h1>
          <p className={styles.subtitulo}>
            Acompanhe as vagas cadastradas e publique novas oportunidades.
          </p>
        </div>
      </header>

      {/* Faixa de identificação da empresa */}
      <div className={styles.faixaEmpresa}>
        <div>
          <strong className={styles.empresaTitulo}>Vagas Empresa</strong>
          <p className={styles.empresaNome}>InclusiveTech</p>
        </div>
        <div className={styles.acoesEmpresa}>
          {/* <button className={styles.btnAbrir}>Abrir</button> */}
          <Link to="/vagas/cadastro" className={styles.btnAdicionar}>
            Adicionar nova vaga
          </Link>
        </div>
      </div>

      {/* Lista de vagas */}
      <section className={styles.bloco}>
        <div className={styles.blocoHeader}>
          <h3 className={styles.blocoTitulo}>Todas as vagas</h3>
          {!carregando && !erro && (
            <span className={styles.badgeContagem}>
              {vagas.length} cadastradas
            </span>
          )}
        </div>

        {/* Estado de carregamento */}
        {carregando && (
          <p className={styles.estadoVazio}>Carregando vagas...</p>
        )}

        {/* Estado de erro */}
        {!carregando && erro && <p className={styles.estadoVazio}>{erro}</p>}

        {/* Estado vazio (sem erro, mas sem vagas) */}
        {!carregando && !erro && vagas.length === 0 && (
          <p className={styles.estadoVazio}>Nenhuma vaga cadastrada ainda.</p>
        )}

        {/* Grid de vagas */}
        {!carregando && !erro && vagas.length > 0 && (
          <div className={styles.grid}>
            {vagas.map((vaga) => (
              <div key={vaga.id} className={styles.vagaCard}>
                <div className={styles.vagaTopo}>
                  <strong className={styles.vagaTitulo}>{vaga.titulo}</strong>

                  <span className={styles.statusBadge}>
                    {vaga.ativo ? "Ativa" : "Inativa"}
                  </span>
                </div>

                <p className={styles.vagaInfo}>{vaga.cargo}</p>

                <p className={styles.vagaInfo}>{vaga.modalidade}</p>

                <p className={styles.vagaInfo}>{vaga.nivel}</p>

                <p className={styles.vagaInfo}>{vaga.regiao}</p>

                <div className={styles.skillsRow}>
                  {vaga.skills.map((skill) => (
                    <span key={skill} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Aviso de rodapé */}
      <div className={styles.avisoRodape}>
        ⓘ Conectado como InclusiveTech. Rotas protegidas e mapa agregado ativos.
      </div>
    </div>
  );
}
