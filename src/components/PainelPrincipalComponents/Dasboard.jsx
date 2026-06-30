// Dashboard.jsx
import { useState, useEffect } from "react";
import { buscarUltimosRegistros } from "../../services/dashboardService"; // ← novo import
import styles from "../../styles/dashboard.module.css";
import { buscarInsights } from "../../services/insightsService";
import MapaCalor from "../../components/PainelPrincipalComponents/MapaCalor";
import { obterUltimoMatch } from "../../services/matchIA";

// ⚠️ MOCK — ainda não temos o formato confirmado de /dashboard/ultimos-registros
// para as métricas. Mantido fixo por enquanto, só a lista de vagas abaixo
// já está puxando dado real.
const METRICAS = [
  {
    label: "Vagas da Empresa",
    valor: 3,
    cor: "azul",
    desc: "retorno autorizado do backend",
  },
  {
    label: "Matches Realizados",
    valor: 0,
    cor: "verde",
    desc: "gere um match para visualizar",
  },
  {
    label: "Meta ESG Atingida",
    valor: "45%",
    cor: "roxo",
    desc: "configurada na empresa logada",
  },
  {
    label: "Diversidade Atual",
    valor: "0%",
    cor: "laranja",
    desc: "gere um match para calcular",
  },
  {
    label: "Talentos no Match",
    valor: 0,
    cor: "verdeClaro",
    desc: "gere um match para visualizar",
  },
];

const GRUPOS_DISPONIVEIS = ["MULHER", "PCD", "NEGRO", "INDIGENA", "LGBTQIA+"];

function obterListaCandidatos(data) {
  if (data?.resposta) return obterListaCandidatos(data.resposta);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.candidatos)) return data.candidatos;
  if (Array.isArray(data?.matches)) return data.matches;
  if (Array.isArray(data?.resultados)) return data.resultados;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.resultado?.candidatos)) return data.resultado.candidatos;
  if (Array.isArray(data?.match?.candidatos)) return data.match.candidatos;
  return [];
}

function obterTituloVagaUltimoMatch(data) {
  return (
    data?.payload?.vaga?.titulo ??
    data?.vaga?.titulo ??
    data?.resposta?.vaga?.titulo ??
    data?.resposta?.payload?.vaga?.titulo ??
    null
  );
}

function obterScore(candidato) {
  const valor =
    candidato?.score ??
    candidato?.score_match ??
    candidato?.matchScore ??
    candidato?.compatibilidade ??
    candidato?.percentual ??
    candidato?.nota ??
    candidato?.notaFinal ??
    candidato?.scoreFinal ??
    candidato?.pontuacao ??
    candidato?.candidato?.score ??
    candidato?.candidato?.score_match ??
    candidato?.candidato?.matchScore ??
    candidato?.candidato?.compatibilidade ??
    candidato?.candidato?.percentual ??
    candidato?.candidato?.nota ??
    candidato?.candidato?.notaFinal ??
    candidato?.candidato?.scoreFinal ??
    candidato?.candidato?.pontuacao ??
    0;

  const numero = Number(valor);
  if (!Number.isFinite(numero)) return 0;

  return numero > 0 && numero <= 1 ? numero * 100 : numero;
}

function formatarScore(candidato) {
  const score = obterScore(candidato);
  return Number.isInteger(score) ? `${score}%` : `${score.toFixed(1)}%`;
}

function obterNomeCandidato(candidato) {
  return (
    candidato?.nome ??
    candidato?.candidato?.nome ??
    candidato?.candidato_id ??
    candidato?.nomeCompleto ??
    candidato?.email ??
    "Candidato"
  );
}

function obterSkillsCandidato(candidato) {
  const skills = candidato?.skills ?? candidato?.candidato?.skills ?? [];
  if (Array.isArray(skills)) return skills.join(", ");
  return skills;
}

function obterTop5UltimoMatch() {
  return obterListaCandidatos(obterUltimoMatch())
    .sort((a, b) => obterScore(b) - obterScore(a))
    .slice(0, 5);
}

export default function Dashboard() {
  // ── Estado novo: dados reais da API ──────────────────────
  const [vagas, setVagas] = useState([]);
  const [carregandoVagas, setCarregandoVagas] = useState(true);
  const [erroVagas, setErroVagas] = useState(null);

  // ── Estados que já existiam ──────────────────────────────
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [gruposSelecionados, setGruposSelecionados] = useState([
    "MULHER",
    "LGBTQIA+",
  ]);
  const [diversidadeMinima, setDiversidadeMinima] = useState(40);

  //mapa

  const [talentosMapa, setTalentosMapa] = useState([]);
  const [carregandoMapa, setCarregandoMapa] = useState(true);
  const [melhoresCandidatos, setMelhoresCandidatos] = useState([]);
  const [tituloVagaUltimoMatch, setTituloVagaUltimoMatch] = useState(null);

  useEffect(() => {
    const ultimoMatch = obterUltimoMatch();
    setMelhoresCandidatos(obterTop5UltimoMatch());
    setTituloVagaUltimoMatch(obterTituloVagaUltimoMatch(ultimoMatch));
  }, []);

  // novo useEffect, separado do das vagas
  useEffect(() => {
    async function buscarDadosMapa() {
      try {
        const data = await buscarInsights();
        setTalentosMapa(data);
      } catch (error) {
        console.error("Erro ao carregar mapa:", error);
      } finally {
        setCarregandoMapa(false);
      }
    }
    buscarDadosMapa();
  }, []);

  // ── Busca os dados reais ao montar o componente ──────────
  useEffect(() => {
    async function buscarDados() {
      try {
        const data = await buscarUltimosRegistros();
        // ⚠️ "ultimasVagas" é meu melhor chute de nome de campo —
        // ajuste aqui quando você confirmar o JSON real do backend
        setVagas(data?.ultimasVagas ?? []);
      } catch (error) {
        setErroVagas("Não foi possível carregar as vagas.");
        console.error(error);
      } finally {
        setCarregandoVagas(false);
      }
    }
    buscarDados();
  }, []);

  function adicionarSkill() {
    const skill = skillInput.trim();
    if (!skill || skills.includes(skill)) return;
    setSkills((prev) => [...prev, skill]);
    setSkillInput("");
  }

  function toggleGrupo(grupo) {
    setGruposSelecionados((prev) =>
      prev.includes(grupo) ? prev.filter((g) => g !== grupo) : [...prev, grupo]
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Cabeçalho */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.titulo}>Dashboard da Empresa</h1>
          <p className={styles.subtitulo}>
            Veja apenas dados da empresa logada, vagas e matches autorizados.
          </p>
        </div>
      </header>

      {/* Saudação */}
      <section className={styles.saudacao}>
        <h2>Olá, recrutador</h2>
        <p>Vaga, match e talentos conectados ao backend.</p>
      </section>

      {/* Métricas — ainda mock, ver aviso no topo do arquivo */}
      <section className={styles.metricasGrid}>
        {METRICAS.map((m) => (
          <div key={m.label} className={styles.metricaCard}>
            <div className={`${styles.metricaIcone} ${styles[m.cor]}`} />
            <span className={styles.metricaLabel}>{m.label}</span>
            <strong className={styles.metricaValor}>{m.valor}</strong>
            <span className={styles.metricaDesc}>{m.desc}</span>
          </div>
        ))}
      </section>

      <div className={styles.corpo}>
        <div className={styles.colunaPrincipal}>
          {/* Últimas vagas — agora com dado real */}
          <section className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Últimas 5 vagas</h3>
            <p className={styles.blocoSubtitulo}>
              Vagas retornadas pela API apenas para a empresa logada.
            </p>

            {carregandoVagas && (
              <p className={styles.blocoSubtitulo}>Carregando vagas...</p>
            )}
            {!carregandoVagas && erroVagas && (
              <p className={styles.blocoSubtitulo}>{erroVagas}</p>
            )}
            {!carregandoVagas && !erroVagas && vagas.length === 0 && (
              <p className={styles.blocoSubtitulo}>Nenhuma vaga encontrada.</p>
            )}

            {!carregandoVagas && !erroVagas && vagas.length > 0 && (
              <div className={styles.listaVagas}>
                {vagas.map((vaga) => (
                  <div key={vaga.id ?? vaga.titulo} className={styles.vagaItem}>
                    <div>
                      <strong className={styles.vagaTitulo}>
                        {vaga.titulo}
                      </strong>
                      <p className={styles.vagaInfo}>
                        {vaga.nivel} | {vaga.regiao}
                      </p>
                      <p className={styles.vagaSkills}>
                        {vaga.skills?.join?.(", ") ?? vaga.skills}
                      </p>
                    </div>
                    <button className={styles.btnGerarMatch}>
                      Gerar match
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className={styles.duasColunas}>
            {/* Criar nova vaga — sem mudanças, continua igual */}
            
            {/* Linkar enpoint aqui */}
            <section className={styles.bloco}>
              <h3 className={styles.blocoTitulo}>Procurar Matching</h3>

              <label className={styles.label}>Título da Vaga</label>
              <input
                className={styles.input}
                placeholder="Ex: Analista de Dados"
              />

              <label className={styles.label}>Skills</label>
              <div className={styles.skillRow}>
                <input
                  className={styles.input}
                  placeholder="Adicionar skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && adicionarSkill()}
                />
                <button className={styles.btnAdd} onClick={adicionarSkill}>
                  + Add
                </button>
              </div>
              {skills.length > 0 && (
                <div className={styles.tagsContainer}>
                  {skills.map((s) => (
                    <span key={s} className={styles.tag}>
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <label className={styles.label}>Nível</label>
              <select className={styles.input}>
                <option>PLENO</option>
                <option>JUNIOR</option>
                <option>SENIOR</option>
              </select>

              <label className={styles.label}>Região</label>
              <select className={styles.input}>
                <option>Recife</option>
                <option>São Paulo</option>
                <option>Florianópolis</option>
              </select>

              <label className={styles.label}>Matching minímo</label>
              <input
                type="range"
                min="0"
                max="100"
                value={diversidadeMinima}
                onChange={(e) => setDiversidadeMinima(e.target.value)}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span>0%</span>
                <span>{diversidadeMinima}%</span>
                <span>100%</span>
              </div>

              <label className={styles.label}>Grupos Prioritários</label>
              <div className={styles.gruposGrid}>
                {GRUPOS_DISPONIVEIS.map((grupo) => (
                  <button
                    key={grupo}
                    type="button"
                    onClick={() => toggleGrupo(grupo)}
                    className={`${styles.chip} ${
                      gruposSelecionados.includes(grupo)
                        ? styles.chipMarcado
                        : ""
                    }`}
                  >
                    {grupo}
                  </button>
                ))}
              </div>

              <div className={styles.botoesForm}>
                <button className={styles.btnGerarMatchPrincipal}>
                  Gerar Match
                </button>
              </div>
            </section>

            {/* Melhores matches — sem mudanças, continua mock */}
            <section className={styles.bloco}>
              <div className={styles.blocoHeaderFlex}>
                <div>
                  <p className={styles.vagaDisputada}>
                    Vaga disputada:{" "}
                    {tituloVagaUltimoMatch ?? "gere um match para carregar"}
                  </p>
                  <h3 className={styles.blocoTitulo}>
                    Pesquisa ultima vaga
                  </h3>
                </div>
              </div>
              <p className={styles.avisoLgpd}>
                Observação LGPD: exibimos nome, skills e score necessários para
                o recrutamento. Dados sensíveis ficam protegidos pelo backend.
              </p>
              {melhoresCandidatos.length === 0 && (
                <div className={styles.semDados}>
                  Nenhum candidato exibido. Gere um match para ver apenas
                  resultados autorizados da empresa logada.
                </div>
              )}

              {melhoresCandidatos.length > 0 && (
                <div className={styles.listaMatchesDashboard}>
                  {melhoresCandidatos.map((candidato, index) => (
                    <div
                      key={candidato.id ?? candidato.email ?? index}
                      className={styles.matchItemDashboard}
                    >
                      <div>
                        <strong className={styles.matchNomeDashboard}>
                          {index + 1}. {obterNomeCandidato(candidato)}
                        </strong>
                        <p className={styles.matchSkillsDashboard}>
                          {obterSkillsCandidato(candidato) ||
                            "Skills nao informadas"}
                        </p>
                        <p className={styles.matchNotaDashboard}>
                          Nota final por Score: {formatarScore(candidato)}
                        </p>
                      </div>
                      <span className={styles.matchScoreDashboard}>
                        {formatarScore(candidato)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Coluna direita — sem mudanças, continua mock */}
        <aside className={styles.colunaDireita}>
          <section className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Mapa de Talentos</h3>
            <div className={styles.mapaPlaceholder}>
              {carregandoMapa && (
                <p className={styles.mensagemCentral}>Carregando mapa...</p>
              )}
              {!carregandoMapa && <MapaCalor pontos={talentosMapa} />}
            </div>
            <p className={styles.mapaDesc}>
              Dados agregados autorizados para a empresa logada. Nenhum dado
              pessoal de candidato é exibido.
            </p>
          </section>

          <section className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Empresa Logada</h3>
            <p className={styles.infoLinha}>
              Nome: <strong>Inova Brasil</strong>
            </p>
            <p className={styles.infoLinha}>
              Meta ESG: <strong>45%</strong>
            </p>
            <p className={styles.infoLinha}>
              Grupos: <strong>MULHER, LGBTQIA+</strong>
            </p>
          </section>

          <section className={styles.blocoDestaque}>
            <h3 className={styles.blocoTituloDestaque}>✓ Impacto ESG</h3>
            <strong className={styles.impactoValor}>45%</strong>
            <p className={styles.impactoDesc}>
              meta de diversidade configurada para a empresa logada.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
