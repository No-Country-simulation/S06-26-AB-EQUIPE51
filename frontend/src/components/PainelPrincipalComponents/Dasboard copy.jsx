// Dashboard.jsx
import { useState, useEffect } from "react";
import { buscarUltimosRegistros } from "../../services/dashboardService"; // ← novo import
import styles from "../../styles/dashboard.module.css";
import { buscarInsights } from "../../services/insightsService";
import MapaCalor from "../../components/PainelPrincipalComponents/MapaCalor";
import { obterUltimoMatch } from "../../services/matchIA";
import { executarMatchPorVaga } from "../../services/matchIA";
import { buscarEmpresaLogadaId } from "../../services/usuarioLogadoService";
import { listarVagas } from "../../services/vagaService";
import { buscarEmpresa } from "../../services/empresaService";
import { setUltimoMatch } from "../../services/matchStore";
import { getUltimoMatch } from "../../services/matchStore";





const METRICAS = [
  {
    label: "Vagas da Empresa",
    valor: 5,
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
  const [listaVagas, setListaVagas] = useState([]);
  const [empresa, setEmpresa] = useState(null);
  
  // ── Estados que já existiam ──────────────────────────────
  const [skillInput, setSkillInput] = useState("");
  const [titulo, setTitulo] = useState("");
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const [nivel, setNivel] = useState("PLENO");
  const [regiao, setRegiao] = useState("Florianópolis");
  const [skills, setSkills] = useState([]);
  const [gruposSelecionados, setGruposSelecionados] = useState([
    "MULHER",
    "LGBTQIA+",
  ]);
  const [diversidadeMinima, setDiversidadeMinima] = useState(40);

  useEffect(() => {
  async function carregarEmpresa() {
    try {
      const empresaId = await buscarEmpresaLogadaId();

      if (!empresaId) return;

      const dadosEmpresa = await buscarEmpresa(empresaId);

      //console.log("Empresa:", dadosEmpresa);

      setEmpresa(dadosEmpresa);
    } catch (erro) {
      console.error("Erro ao carregar empresa:", erro);
    }
  }

  carregarEmpresa();
}, []);

  async function gerarMatch() {
  try {
    //console.log("Gerando Match...");

    if (!vagaSelecionada) {
      toast.error("Selecione uma vaga.");
      return;
    }


    

    const vaga = {
      id: vagaSelecionada?.id,
      titulo: vagaSelecionada?.titulo,
      cargo: vagaSelecionada?.cargo,
      
      nivel: vagaSelecionada?.nivel,
      regiao: vagaSelecionada?.regiao,
      skills: skills.length > 0 ? skills : vagaSelecionada?.skills,
      modalidade: vagaSelecionada?.modalidade,
    };

    const filtros = {
    
    };


    const empresaId = await buscarEmpresaLogadaId();
    if (!empresaId) {
      toast.error("Empresa não encontrada.");
      return;
    }


    //console.log("Empresa:", empresaId);
    //console.log("Vaga:", vaga);
    

    const resposta = await executarMatchPorVaga({
      empresaId,
      vaga,
      filtros,
    });

    
    setUltimoMatch(resposta);

    //console.log("SALVANDO MATCH:", resposta);
    //console.log("MATCH STORE:", getUltimoMatch());

    setMelhoresCandidatos(resposta.candidatos);

    setTituloVagaUltimoMatch(vaga.titulo);
    
    setUltimoMatch(resposta);

    //console.log(resposta.candidatos);

    //console.log("Resposta:", resposta);

  } catch (erro) {
    console.error("Erro ao gerar Match:", erro);
  }
}

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

        //console.log("Mapa:", data);
        //console.log(vagaSelecionada);
        //console.log("INSIGHTS:", data);


        const pontos = (data.mapa_talentos || []).map((item) => ({
          latitude: item.lat,
          longitude: item.lon,
          nome: item.regiao,
          concentracao: item.concentracao,
        }));

        setTalentosMapa(pontos);

      } catch (error) {
        console.error("Erro ao carregar mapa:", error);
      } finally {
        setCarregandoMapa(false);
      }
    }

    buscarDadosMapa();
  }, []);

  useEffect(() => {
  async function carregarVagas() {
    try {
      const empresaId = await buscarEmpresaLogadaId();

      const vagas = await listarVagas();
      setListaVagas(vagas);
      setVagas(vagas.slice(0,5));
      setCarregandoVagas(false);

      const minhasVagas = vagas.filter(
        (vaga) => vaga.empresaId === empresaId
      );



    } catch (err) {
      console.error("Erro ao carregar vagas:", err);
    }
  }

  carregarVagas();
  }, []);

  // ── Busca os dados reais ao montar o componente ──────────


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

const scoreMedio =
  melhoresCandidatos.length > 0
    ? Math.round(
        melhoresCandidatos.reduce(
          (total, candidato) => total + (candidato.score_match ?? 0),
          0
        ) / melhoresCandidatos.length
      )
    : 0;


const diversidadeAtual =
  melhoresCandidatos.length > 0
    ? Math.round(
        (melhoresCandidatos.filter(
          (c) => (c.badge_diversidade?.length ?? 0) > 0
        ).length /
          melhoresCandidatos.length) *
          100
      )
    : 0;
  
  const gruposDiversidade = {
    MULHER: 0,
    NEGRO: 0,
    PCD: 0,
    INDIGENA: 0,
    "LGBTQIA+": 0,
  };

  melhoresCandidatos.forEach((candidato) => {
    (candidato.badge_diversidade || []).forEach((grupo) => {
      if (gruposDiversidade[grupo] !== undefined) {
        gruposDiversidade[grupo]++;
      }
    });
  });

//console.log(gruposDiversidade);

const metricas = [
  {
    label: "Vagas da Empresa",
    valor: listaVagas.length,
    cor: "azul",
    desc: "vagas cadastradas",
  },
  {
    label: "Talentos Encontrados",
    valor: melhoresCandidatos.length,
    cor: "verde",
    desc: "último match realizado",
  },
  {
    label: "Meta ESG Atingida",
    valor: `${empresa?.metaDiversidade ?? 0}%`,
    cor: "roxo",
    desc: "configurada na empresa",
  },
  {
    label: "Diversidade Atual",
    valor: `${diversidadeAtual}%`,
    cor: "laranja",
    desc: "último match realizado",
  },
  {
  label: "Score Médio",
  valor: `${scoreMedio}%`,
  cor: "verdeClaro",
  desc: "último match realizado",
},
];



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
        <h2>Olá, {empresa?.nomeEmpresa || "Recrutador!"}</h2>
        <p>Vaga, match e talentos conectados ao backend.</p>
      </section>

      {/* Métricas — ainda mock, ver aviso no topo do arquivo */}
      <section className={styles.metricasGrid}>
        {metricas.map((m) => (
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
            <div className={styles.listaVagasGrid}>
              {vagas.map((vaga) => (
                <div key={vaga.id ?? vaga.titulo} className={styles.vagaCard}>
                  <div className={styles.vagaCabecalho}>

                    <strong className={styles.vagaTitulo}>
                      {vaga.titulo}
                    </strong>

                    <span className={styles.vagaNivel}>
                      {vaga.nivel}
                    </span>

                  </div>

                  <p className={styles.vagaSkills}>
                    {Array.isArray(vaga.skills)
                      ? vaga.skills.join(" • ")
                      : vaga.skills}
                  </p>

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

              <label className={styles.label}>Vaga</label>

              <select
                className={styles.input}
                value={titulo}
                onChange={(e) => {
                  const vaga = listaVagas.find(v => v.id === e.target.value);
                  setTitulo(e.target.value);
                  setVagaSelecionada(vaga);
                }}
              >
                <option value="">Selecione uma vaga</option>

                {listaVagas.map((vaga) => (
                  <option key={vaga.id} value={vaga.id}>
                    {vaga.titulo}
                  </option>
                ))}
              </select>

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
              <select 
              className={styles.input}
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              >
                <option>PLENO</option>
                <option>JUNIOR</option>
                <option>SENIOR</option>
              </select>

              <label className={styles.label}>Região</label>
              <select 
              className={styles.input}
              value={regiao}
              onChange={(e) => setRegiao(e.target.value)}
              >
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
                <button 
                  className={styles.btnGerarMatchPrincipal}
                  onClick={gerarMatch}
                >
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
