// RelatorioESG.jsx
import styles from '../../styles/relatorioESG.module.css'
import { getUltimoMatch } from "../../services/matchStore";
import { useEffect, useState } from "react";
import { buscarEmpresa } from "../../services/empresaService";
import { buscarEmpresaLogadaId } from "../../services/usuarioLogadoService";
import { listarVagas } from "../../services/vagaService";
import KpiCard from "../../components/ESG/KpiCard";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  LabelList,
  CartesianGrid,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import { gerarRecomendacoesESG } from "../../services/iaService";



// dados mock — troque pela API real (esgService) quando estiver pronta



export default function RelatorioESG() {
  
  const match = getUltimoMatch() ?? null;

  const [empresa, setEmpresa] = useState(null);
  
  const [ultimasVagas, setUltimasVagas] = useState([]);


  const gruposPrioritarios =
    empresa?.gruposPrioritarios ?? [];


  const matchExecutado = !!match;


  const candidatos = match?.candidatos ?? [];


  //console.log(match);

// ==========================
// MÉTRICAS DO RELATÓRIO ESG
// ==========================
// 
  const totalCandidatos = candidatos.length;

  const scoreMedio =
    totalCandidatos > 0
      ? Math.round(
          candidatos.reduce(
            (total, candidato) =>
              total + (candidato.score_match ?? 0),
            0
          ) / totalCandidatos
        )
      : 0;


  const altaCompatibilidade =
    candidatos.filter(
      (candidato) => candidato.score_match >= 80
    ).length;

  const diversidadeAtual =
    totalCandidatos > 0
      ? Math.round(
          (
            candidatos.filter(
              (candidato) =>
                (candidato.badge_diversidade?.length ?? 0) > 0
            ).length /
            totalCandidatos
          ) * 100
        )
      : 0;
  

  const compatibilidadeMedia =
    totalCandidatos > 0
      ? Math.round(
          candidatos.reduce(
            (acc, c) => acc + (c.score_match ?? 0),
            0
          ) / totalCandidatos
        )
      : 0;


  let recomendacaoIA = "";

  if (compatibilidadeMedia >= 90) {
    recomendacaoIA =
      "Os candidatos encontrados apresentam excelente aderência ao perfil da vaga.";
  } else if (compatibilidadeMedia >= 80) {
    recomendacaoIA =
      "A compatibilidade geral é boa, mas há espaço para ampliar a busca.";
  } else {
    recomendacaoIA =
      "A IA recomenda revisar os critérios da vaga para ampliar o alcance.";
  }

  const gruposDiversidade = {
    MULHER: 0,
    NEGRO: 0,
    PCD: 0,
    INDIGENA: 0,
    "LGBTQIA+": 0,
  };
  //console.log(candidatos);

  candidatos.forEach((candidato) => {
    (candidato.badge_diversidade || []).forEach((grupo) => {
      if (gruposDiversidade[grupo] !== undefined) {
        gruposDiversidade[grupo]++;
      }
    });
  });

  const dadosGraficoDiversidade = Object.entries(gruposDiversidade).map(
    ([name, value]) => ({
      name,
      value,
    })
  );


  const statusMeta =
    diversidadeAtual >= (empresa?.metaDiversidade ?? 0);

  const faltamPontos = Math.max(
    0,
    (empresa?.metaDiversidade ?? 0) - diversidadeAtual
  );

  const vagasConsideradas = 3; // depois vamos buscar da API

  const faixasScore = [
    {
      faixa: "90 - 100%",
      valor: candidatos.filter(c => c.score_match >= 90).length,
    },
    {
      faixa: "80 - 89%",
      valor: candidatos.filter(
        c => c.score_match >= 80 && c.score_match < 90
      ).length,
    },
    {
      faixa: "70 - 79%",
      valor: candidatos.filter(
        c => c.score_match >= 70 && c.score_match < 80
      ).length,
    },
    {
      faixa: "60 - 69%",
      valor: candidatos.filter(
        c => c.score_match >= 60 && c.score_match < 70
      ).length,
    },
    {
      faixa: "Abaixo de 60%",
      valor: candidatos.filter(
        c => c.score_match < 60
      ).length,
    },
  ];

  const perfisAnonimizados = 100;




  useEffect(() => {
  async function carregarEmpresa() {
    try {
      const empresaId = await buscarEmpresaLogadaId();

      if (!empresaId) return;

      const dadosEmpresa = await buscarEmpresa(empresaId);

      setEmpresa(dadosEmpresa);

      const vagas = await listarVagas();

      const vagasEmpresa = vagas.filter(
        vaga => vaga.empresaId === empresaId
      );

      setUltimasVagas(
        vagasEmpresa.slice(0,3)
      );
    } catch (erro) {
      console.error("Erro ao carregar empresa:", erro);
    }
  }

  carregarEmpresa();
}, []);


  //console.log(dadosGraficoDiversidade);

  const diferencaMeta = Math.max(
    0,
    (empresa?.metaDiversidade ?? 0) - diversidadeAtual
  );

  const mensagemESG =
    diferencaMeta === 0
      ? "Sua empresa atingiu a meta de diversidade."
      : `Faltam ${diferencaMeta} pontos para atingir a meta ESG.`;


  const testarIA = async () => {
    try {
      const payload = {
        empresa_id: empresa?.id,

        vaga: {
          titulo: ultimasVagas?.[0]?.titulo,
          cargo: "BACKEND_DEVELOPER",
          modalidade: ultimasVagas?.[0]?.modalidade,
          skills: ultimasVagas?.[0]?.skills ?? [],
          nivel: ultimasVagas?.[0]?.nivel,
          regiao: ultimasVagas?.[0]?.regiao,
        },
      };

      console.log("Enviando para IA:", payload);

      const resposta = await gerarRecomendacoesESG(payload);

      console.log("Resposta IA:", resposta);

      alert("IA respondeu! Veja o console (F12).");
    } catch (erro) {
      console.error("Erro IA:", erro);

      if (erro.response) {
        console.log("Status:", erro.response.status);
        console.log("Resposta:", erro.response.data);
      }

      alert("Erro ao chamar IA.");
    }
  };

  const coresFaixas = [
    "#16A34A",
    "#86EFAC",
    "#FACC15",
    "#FB923C",
    "#D1D5DB"
  ];

  //const porcentagem =
  //Math.round(grupo.value)


  return (
    <div className={styles.pagina}>

      {/* 1. HEADER */}
      <header className={styles.header}>

        <div className={styles.headerEsquerda}>

          <h1 className={styles.titulo}>
            Relatório ESG
          </h1>

          <p className={styles.subtitulo}>
            Indicadores baseados em empresa, vagas, candidatos e último match.
          </p>

        </div>

        <div className={styles.headerDireita}>

          <div className={styles.cardHeader}>

            <span className={styles.cardTitulo}>
              Empresa
            </span>

            <strong>
              {empresa?.nomeEmpresa}
            </strong>

            <small>
              Meta ESG: {empresa?.metaDiversidade ?? 0}%
            </small>

          </div>

          <div className={styles.cardHeader}>

            <span className={styles.cardTitulo}>
              Último Match
            </span>

            <strong>
              {totalCandidatos} candidatos
            </strong>

            <small>
              Score médio: {scoreMedio}%
            </small>

          </div>

        </div>

      </header>

      {/* 2. FAIXA DA EMPRESA */}
      <div className={styles.faixaEmpresa}>
        <div>
          <strong className={styles.empresaTitulo}>Relatório ESG</strong>
          <p className={styles.empresaDesc}>
            Indicadores baseados no último match.
          </p>
        </div>

        <span className={styles.badgeEmpresa}>
          {empresa?.nomeEmpresa}
        </span>
      </div>

      {/* 3. KPI CARDS (IMPORTANTE - SÓ UMA VEZ) */}
      <section className={styles.metricasGrid}>

        {/* 🔥 AQUI FICAM SEUS Kpis */}
          <KpiCard
            titulo="Meta ESG"
            valor={empresa?.metaDiversidade ?? 0}
            sufixo="%"
            descricao="configurada no perfil da empresa"
            cor="#6366F1"
            progresso={empresa?.metaDiversidade ?? 0}
          />

          <KpiCard
            titulo="Resultado do Match"
            valor={diversidadeAtual}
            sufixo="%"
            descricao="diversidade cadastrada"
            cor="#10B981"
            progresso={diversidadeAtual}
          />

          <KpiCard
            titulo="Status da Meta"
            valor={statusMeta ? "✔" : "🏆"}
            descricao={
              statusMeta
                ? "Meta atingida"
                : `Faltam ${faltamPontos} pontos`
            }
            cor={statusMeta ? "#10B981" : "#F59E0B"}
          />

          <KpiCard
            titulo="Compatibilidade Média"
            valor={compatibilidadeMedia}
            sufixo="%"
            descricao="média dos candidatos"
            cor="#2563EB"
            progresso={compatibilidadeMedia}
          />

          <KpiCard
            titulo="Alta compatibilidade"
            valor={altaCompatibilidade}
            descricao="candidatos acima de 80%"
            cor="#10B981"
            progresso={
              totalCandidatos > 0
                ? Math.round((altaCompatibilidade / totalCandidatos) * 100)
                : 0
            }
          />

          <KpiCard
            titulo="Diversidade no match"
            valor={diversidadeAtual}
            sufixo="%"
            descricao="resultado do último match"
            cor="#F59E0B"
            progresso={diversidadeAtual}
          />

          <KpiCard
            titulo="Base analisável"
            valor={candidatos.length}
            descricao="candidatos avaliados"
            cor="#3B82F6"
          />
          <KpiCard
            titulo="Perfis anonimizados"
            valor={perfisAnonimizados}
            sufixo="%"
            descricao="LGPD garantida"
            cor="#2563EB"
            progresso={100}
          />

          <KpiCard
            titulo="Vagas consideradas"
            valor={vagasConsideradas}
            descricao="vagas analisadas"
            cor="#F59E0B"
          />

      </section>

      {/* 4. CONTEÚDO PRINCIPAL */}
      <div className={styles.conteudo}>

        {/* ALERTA */}
        {!matchExecutado && (
          <div className={styles.avisoAlerta}>
            ⚠️ Gere um match para popular este relatório
          </div>
        )}

        {/* 5. GRÁFICOS (AQUI ENTRA O RECHARTS) */}
        <div className={styles.areaGraficos}>

          <div className={styles.cardGrafico}>

            <h3 className={styles.tituloGrafico}>
              Distribuição por grupo prioritário
            </h3>

            <div className={styles.graficoContainer}>

              <div className={styles.graficoPizza}>

                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>

                    <Pie
                      data={dadosGraficoDiversidade}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={46}
                      outerRadius={68}
                      paddingAngle={2}
                      cornerRadius={6}
                  >

                      {dadosGraficoDiversidade.map((entry, index) => (
                          <Cell
                              key={index}
                              fill={[
                                  "#6D5EF8",
                                  "#3B82F6",
                                  "#22C55E",
                                  "#F59E0B",
                                  "#9CA3AF",
                              ][index]}
                          />
                      ))}

                      <label
                        content={({ viewBox }) => {
                          const { cx, cy } = viewBox;
                          return (
                            <text
                              x={cx}
                              y={cy}  
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={cx}
                                dy="-6"
                                fontSize={24}
                                fontWeight="700"
                              >
                                {totalCandidatos}
                              </tspan>
                              <tspan
                                x={cx}
                                dy="22"
                                fontSize={12}
                                fill="#6B7280"
                              >
                                candidatos
                              </tspan>
                            </text>
                          );
                        }}

                      />
                  </Pie>


                  </PieChart>
                </ResponsiveContainer>

              </div>

              <div className={styles.legendaGrafico}>

                {dadosGraficoDiversidade.map((grupo, index) => (

                  <div 
                    key={grupo.name}
                    className={styles.itemLegenda}
                  > 

                      <div className={styles.itemEsquerda}>

                          <span
                              className={styles.corLegenda}
                              style={{
                                  background: [
                                      "#6D5EF8",
                                      "#3B82F6",
                                      "#22C55E",
                                      "#F59E0B",
                                      "#9CA3AF",
                                  ][index],
                              }}
                          />

                          <span>{grupo.name}</span>

                      </div>

                      <strong>
                        {Math.round((grupo.value / totalCandidatos) * 100)}%
                        {" "}
                        ({grupo.value})
                      </strong>

                  </div>

                ))}

              </div>

            </div>

          </div>

           <div className={styles.cardGrafico}>

              <h3>
                Compatibilidade por faixa de score
             </h3>

                <ResponsiveContainer
                  width="100%"
                  height={190}
                >

                  <BarChart
                    layout="vertical"
                    data={faixasScore}
                  >

                    <XAxis type="number" hide />

                    <YAxis
                      type="category"
                      dataKey="faixa"
                    />

                    <Tooltip />
                    <CartesianGrid
                      strokeDasharray="4 4"
                      horizontal={false}
                    />
                      <Bar
                          dataKey="valor"
                          radius={[8,8,8,8]}
                          fill="#6366F1"
                      >
                          <LabelList
                              dataKey="valor"
                              position="right"
                          />
                      </Bar>  

                  </BarChart>

                </ResponsiveContainer>

          </div>

        </div>

        {/* 6. BLOCO PRIVACIDADE + GRUPOS */}
        <div className={styles.tresColunas}>

          <section className={styles.bloco}>
            <h3>Privacidade dos resultados</h3>
            <p>Todos os candidatos exibidos neste relatório foram anonimizados conforme as diretrizes da LGPD. Apenas indicadores agregados são apresentados.</p>
          </section>

          <section className={styles.bloco}>
            <h3>Grupos prioritários</h3>

            <div className={styles.gruposRow}>
              {gruposPrioritarios.map(grupo => (
                <span key={grupo}>{grupo}</span>
              ))}
            </div>

          </section>
          <section className={styles.bloco}>

            <h3 className={styles.blocoTitulo}>
                Últimas vagas consideradas
            </h3>

            {ultimasVagas.map((vaga)=>(

                <div
                    key={vaga.id}
                    className={styles.itemVaga}
                >

                    <strong>
                        {vaga.titulo}
                    </strong>

                    <small>
                        {vaga.modalidade} • {vaga.nivel}
                    </small>

                </div>

            ))}
          
        </section>
        <section className={styles.bannerESG}>

          <div>

              <h3>
                  ⭐ Impacto ESG do último match
              </h3>

              <div className={styles.textoBanner}>
                <p>
                  {mensagemESG}
                </p>
                <small>
                  {recomendacaoIA}
                </small>
              </div>

          </div>

          <button 
            className={styles.botaoIA}
            onClick={testarIA}>
                Testar IA →

          </button>

      </section>

        </div>

      </div>
    </div>
  );
}