// MatchIA.jsx
import { useEffect, useState } from "react";
import { obterUltimoMatch } from "../../services/matchIA"
import styles from '../../styles/matchIA.module.css'
import { gerarRecomendacoesESG } from "../../services/iaService";
import ModalAnaliseIA from "../../components/PainelPrincipalComponents/ModalAnaliseIA";


function formatarCargo(cargo){

    if(!cargo) return "";

    return cargo
        .replaceAll("_"," ")
        .toLowerCase()
        .split(" ")
        .map(palavra =>
            palavra.charAt(0).toUpperCase() +
            palavra.slice(1)
        )
        .join(" ");

}

const formatarSkill = (texto) => {

    return texto
        .toLowerCase()
        .replace(/\b\w/g, letra => letra.toUpperCase());

}



export default function MatchIA() {


  const [abaAtiva, setAbaAtiva] = useState('melhores')
  const [resultadoIA, setResultadoIA] = useState(null);
  const [carregandoIA, setCarregandoIA] = useState(true);
  const [erroIA, setErroIA] = useState(null);

  const ultimoMatch = obterUltimoMatch()

  const vagaSelecionada = ultimoMatch?.payload?.vaga ?? null

  const [modalAberto,setModalAberto]=useState(false);

  const [candidatoSelecionado,setCandidatoSelecionado]=useState(null);

  const extrairSkillsIA = (candidato) => {

    const criterioSkills = candidato?.criterios?.find(
        c => c.criterio === "Skills"
    );

    if (!criterioSkills) return [];

    return criterioSkills.detalhe
        .map(item => {

            const match = item.match(/skill pretendida\s+(.+?),/i);

            return match ? match[1] : null;

        })
        .filter(Boolean);

};


  // ============================
  // DADOS DA IA
  // ============================

  const candidatosIA =
      resultadoIA?.shortlist ?? [];


  const totalCandidatosIA =
      resultadoIA?.total_analisados ?? 0;


  const temMatches =
      candidatosIA.length > 0;


  const gerarMatchIA = async()=>{

  try{

  const payload={

    empresa_id:
        ultimoMatch.payload.empresa_id,

    vaga:vagaSelecionada

  };


  const resposta =
      await gerarRecomendacoesESG(payload);




  console.log("Nova resposta IA:", resposta);


  setResultadoIA(resposta);


  }catch(error){

  console.error(
    "Erro ao gerar IA",
    error
  );

  }

  }

  useEffect(() => {

      async function carregarIA() {

          if (!ultimoMatch?.payload) {

              setCarregandoIA(false);

              return;

          }

          try {

              const resposta =
                  await gerarRecomendacoesESG(
                      ultimoMatch.payload
                  );


              console.log("IA respondeu:", resposta);


              setResultadoIA(resposta);


          } catch(err){

              console.error(err);

              setErroIA(err);

          } finally {

              setCarregandoIA(false);

          }

      }


      carregarIA();


  }, []);



  const compatibilidadeMediaIA =
      candidatosIA.length
          ? Math.round(
              candidatosIA.reduce(
                  (acc,c)=> acc + c.score_final,
                  0
              ) / candidatosIA.length
            )
          : 0;


  const altaCompatibilidadeIA =
      candidatosIA.filter(
          c => c.score_final >= 80
      ).length;




  const diversidadeResultado =
    resultadoIA?.diversidade_alcancada ?? 0;

  return (
    <div className={styles.pagina}>

      {/* Cabeçalho */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.titulo}>Match com IA</h1>
          <p className={styles.subtitulo}>Resultado inteligente com base na compatibilidade de skills, experiência e alinhamento cultural.</p>
        </div>
      </header>

      <div className={styles.conteudo}>

        <div className={styles.colunaPrincipal}>

          {/* Aviso de relatório não gerado */}
          {!temMatches && (
            <div className={styles.avisoRelatorio}>
              <strong>Relatório ainda não gerado</strong>
              <p>Volte ao Dashboard, ajuste os campos da vaga e clique em <strong>GERAR MATCH</strong>. Depois o relatório aparece aqui com dados da API.</p>
            </div>
          )}

          {/* Métricas */}
          <section className={styles.metricasGrid}>

          <div className={styles.metricaCard}>
              <span className={styles.metricaLabel}>
                  Compatibilidade média
              </span>

              <strong className={styles.metricaValor}>
                  {compatibilidadeMediaIA}%
              </strong>

              <span className={styles.metricaDesc}>
                  média dos candidatos
              </span>
          </div>

          <div className={styles.metricaCard}>
              <span className={styles.metricaLabel}>
                  Candidatos encontrados
              </span>

              <strong className={styles.metricaValor}>
                  {totalCandidatosIA}
              </strong>

              <span className={styles.metricaDesc}>
                  retornados pela IA
              </span>
          </div>

          <div className={styles.metricaCard}>
              <span className={styles.metricaLabel}>
                  Alta compatibilidade
              </span>

              <strong className={styles.metricaValor}>
                  {altaCompatibilidadeIA}
              </strong>

              <span className={styles.metricaDesc}>
                  score ≥ 80%
              </span>
          </div>

          <div className={styles.metricaCard}>
              <span className={styles.metricaLabel}>
                  Diversidade
              </span>

              <strong className={styles.metricaValor}>
                  {diversidadeResultado}%
              </strong>

              <span className={styles.metricaDesc}>
                  candidatos diversos
              </span>
          </div>

          </section>

          {/* Abas */}
          <div className={styles.abasRow}>
            <div className={styles.abas}>
              <button
                className={`${styles.aba} ${abaAtiva === 'melhores' ? styles.abaAtiva : ''}`}
                onClick={() => setAbaAtiva('melhores')}
              >
                Melhores Matches
              </button>
              <button
                className={`${styles.aba} ${abaAtiva === 'avaliacao' ? styles.abaAtiva : ''}`}
                onClick={() => setAbaAtiva('avaliacao')}
              >
                Aguardando Avaliação
              </button>
            </div>
           
          </div>

          {/* Aviso LGPD */}
          <div className={styles.avisoLgpd}>
            Observação LGPD: dados pessoais dos candidatos são minimizados. A empresa visualiza nome, skills e score de compatibilidade necessários para a etapa de match.
          </div>

          {resultadoIA?.avisos?.length > 0 && (

            <div className={styles.avisoIA}>

                <h3>Avisos da IA</h3>

                {resultadoIA.avisos.map(aviso=>(

                    <p key={aviso}>
                        ⚠ {aviso}
                    </p>

                ))}

            </div>

            )}

          {/* Estado vazio / lista de matches */}
          {!temMatches ? (
            <div className={styles.semMatch}>
              <strong className={styles.semMatchTitulo}>Nenhum match gerado</strong>
              <p className={styles.semMatchTexto}>
                Execute um match para visualizar apenas perfis anonimizados retornados pelo backend para a empresa logada.
              </p>
            </div>
          ) : (
            <div className={styles.listaMatches}>

            {candidatosIA.map((candidato,index)=>(
                
                <div
                    key={candidato.id}
                    className={styles.cardMatch}
                >
                
                    <div className={styles.rankBadge}>
                        {index + 1}
                    </div>

                    <div className={styles.cardConteudo}>

                        <div className={styles.cardEsquerda}>

                            <div className={styles.avatar}>

                                {candidato.nome
                                    .split(" ")
                                    .map(n => n[0])
                                    .slice(0,2)
                                    .join("")}

                            </div>

                            <div className={styles.infoPrincipal}>

                                <h3 className={styles.nome}>
                                    {candidato.nome}
                                </h3>

                                <span className={styles.cargo}>

                                    {formatarCargo(vagaSelecionada?.cargo)}

                                </span>

                                <div className={styles.skills}>

                                    {extrairSkillsIA(candidato).map(skill => (

                                        <span
                                            key={`${skill}-${index}`}
                                            className={styles.skillTag}
                                        >

                                            {skill}

                                        </span>

                                    ))}

                                </div>

                                <p className={styles.resumoMatch}>
                                    {candidato.resumo ??
                                        "Perfil compatível com os critérios definidos para esta vaga."}
                                </p>

                            </div>

                        </div>

                        <div className={styles.cardDireita}>

                            <div className={styles.scoreCircle}>

                                <strong>

                                    {Math.round(candidato.score_final)}%

                                </strong>

                                <small>

                                    SCORE

                                </small>

                            </div>

                            <button
                                className={styles.botaoDetalhes}
                                onClick={()=>{
                                    setCandidatoSelecionado(candidato);
                                    setModalAberto(true);
                                }}
                            >

                                Ver análise IA ↗

                            </button>

                        </div>

                    </div>

                </div>

            ))}

            </div>
          )}

        </div>

        {/* Coluna direita */}
        <aside className={styles.colunaDireita}>

          <section className={styles.bloco}>
            <div className={styles.blocoHeaderFlex}>
              <h3 className={styles.blocoTitulo}>Vaga selecionada</h3>
              <a href="#" className={styles.linkVerVaga}>Ver vaga</a>
            </div>

            {!vagaSelecionada ? (
              <div className={styles.vagaVaziaRow}>
                <div>
                  <strong className={styles.vagaVaziaTitulo}>Nenhuma vaga selecionada</strong>
                  <p className={styles.vagaVaziaDesc}>InclusiveTech</p>
                  <p className={styles.vagaVaziaInfo}>Sem região | API protegida</p>
                </div>
              </div>
            ) : (
              <div>

                <div className={styles.cardVaga}>

                  <h3 className={styles.nomeVaga}>
                      {vagaSelecionada.titulo}
                  </h3>

                  <p className={styles.infoVaga}>

                      {vagaSelecionada.modalidade}

                      {" • "}

                      {vagaSelecionada.nivel}

                  </p>

                  <p className={styles.regiaoVaga}>

                      📍 {vagaSelecionada.regiao}

                  </p>

                  <button
                      className={styles.botaoGerarIA}
                      onClick={gerarMatchIA}
                  >

                      ✨ Gerar análise inteligente

                  </button>

              </div>

              </div>
            )}
          </section>

          <section className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Critérios da Vaga</h3>
            <div className={styles.criterioLinha}>
              <span>Skills</span>

              <div className={styles.skills}>

                {vagaSelecionada?.skills.map(skill=>(

                <span
                key={skill}
                className={styles.skill}
                >

                {skill}

                </span>

                ))}

              </div>
          </div>

          <div className={styles.criterioLinha}>
              <span>Nível</span>

              <strong>

                  {vagaSelecionada?.nivel}

              </strong>
          </div>

          <div className={styles.criterioLinha}>
              <span>Modalidade</span>

              <strong>

                  {vagaSelecionada?.modalidade}

              </strong>
          </div>

          <div className={styles.criterioLinha}>
              <span>Região</span>

              <strong>

                  {vagaSelecionada?.regiao}

              </strong>
          </div>
          </section>

           <section className={styles.bloco}>

              <h3 className={styles.blocoTitulo}>
                  💡 Sobre esta análise
              </h3>

              <p className={styles.resumoTexto}>

                  {candidatoSelecionado?.resumo ??

                  "Clique em 'Ver análise da IA ' para visualizar o resumo inteligente do candidato."}

              </p>

            </section>

        </aside>
      </div>
      <ModalAnaliseIA

          aberto={modalAberto}

          candidato={candidatoSelecionado}

          onClose={()=>setModalAberto(false)}

      />

    </div>
  )
}