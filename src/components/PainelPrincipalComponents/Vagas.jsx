import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { MatchService } from "../../services/matchIA"
import { listarVagasDaEmpresa } from "../../services/vagaService"
import { buscarUsuarioLogado } from "../../services/usuarioLogadoService"
import styles from "../../styles/vagas.module.css"

function normalizarVagas(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.vagas)) return data.vagas
  if (Array.isArray(data?.data)) return data.data
  return []
}

function normalizarSkills(skills) {
  if (Array.isArray(skills)) return skills
  if (typeof skills === "string") {
    return skills.split(",").map((skill) => skill.trim()).filter(Boolean)
  }
  return []
}

export default function Vagas() {
  const [vagas, setVagas] = useState([])
  const [empresaId, setEmpresaId] = useState(null)
  const [nomeEmpresa, setNomeEmpresa] = useState("Empresa")
  const [payloadMatch, setPayloadMatch] = useState(null)
  const [respostaMatch, setRespostaMatch] = useState(null)
  const [carregandoMatch, setCarregandoMatch] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function buscarVagas() {
      try {
        setErro(null)
        const usuario = await buscarUsuarioLogado()
        const data = await listarVagasDaEmpresa(usuario?.empresa?.id)

        setEmpresaId(usuario?.empresa?.id ?? null)
        setNomeEmpresa(usuario?.empresa?.nomeEmpresa ?? "Empresa")
        setVagas(normalizarVagas(data))
      } catch (error) {
        setErro("Nao foi possivel carregar as vagas.")
        console.error(error)
      } finally {
        setCarregando(false)
      }
    }

    buscarVagas()
  }, [])

  async function gerarMatch(vaga) {
    const payload = MatchService.montarPayload({
      empresaId,
      vaga: {
        ...vaga,
        skills: normalizarSkills(vaga.skills),
      },
      filtros: {},
    })

    setPayloadMatch(payload)
    setRespostaMatch(null)

    try {
      setCarregandoMatch(true)
      const data = await MatchService.executar(payload)
      setRespostaMatch(data)
    } catch (error) {
      setRespostaMatch(error.response?.data ?? {
        message: error.message,
      })
      console.error(error)
    } finally {
      setCarregandoMatch(false)
    }
  }

  return (
    <div className={styles.pagina}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.titulo}>Vagas da Empresa</h1>
          <p className={styles.subtitulo}>
            Acompanhe as vagas cadastradas e publique novas oportunidades.
          </p>
        </div>
      </header>

      <div className={styles.faixaEmpresa}>
        <div>
          <strong className={styles.empresaTitulo}>Vagas Empresa</strong>
          <p className={styles.empresaNome}>{nomeEmpresa}</p>
        </div>
        <div className={styles.acoesEmpresa}>
          <Link to="/vagas/cadastro" className={styles.btnAdicionar}>
            Adicionar nova vaga
          </Link>
        </div>
      </div>

      <section className={styles.bloco}>
        <div className={styles.blocoHeader}>
          <h3 className={styles.blocoTitulo}>Todas as vagas</h3>
          {!carregando && !erro && (
            <span className={styles.badgeContagem}>
              {vagas.length} cadastradas
            </span>
          )}
        </div>

        {carregando && (
          <p className={styles.estadoVazio}>Carregando vagas...</p>
        )}

        {!carregando && erro && <p className={styles.estadoVazio}>{erro}</p>}

        {!carregando && !erro && vagas.length === 0 && (
          <p className={styles.estadoVazio}>Nenhuma vaga cadastrada ainda.</p>
        )}

        {!carregando && !erro && vagas.length > 0 && (
          <div className={styles.grid}>
            {vagas.map((vaga) => {
              const skills = normalizarSkills(vaga.skills)

              return (
                <div key={vaga.id ?? vaga.titulo} className={styles.vagaCard}>
                  <div className={styles.vagaTopo}>
                    <strong className={styles.vagaTitulo}>
                      {vaga.titulo ?? "Vaga sem titulo"}
                    </strong>

                    <span className={styles.statusBadge}>
                      {vaga.ativo === false ? "Inativa" : "Ativa"}
                    </span>
                  </div>

                  <p className={styles.vagaInfo}>
                    {vaga.cargo ?? "Cargo nao informado"}
                  </p>
                  <p className={styles.vagaInfo}>
                    {vaga.modalidade ?? "Modalidade nao informada"}
                  </p>
                  <p className={styles.vagaInfo}>
                    {vaga.nivel ?? "Nivel nao informado"}
                  </p>
                  <p className={styles.vagaInfo}>
                    {vaga.regiao ?? "Regiao nao informada"}
                  </p>

                  {skills.length > 0 && (
                    <div className={styles.skillsRow}>
                      {skills.map((skill) => (
                        <span key={skill} className={styles.skillTag}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className={styles.btnJson}
                    onClick={() => gerarMatch(vaga)}
                    disabled={carregandoMatch}
                  >
                    {carregandoMatch ? "Enviando..." : "Gerar JSON / Match"}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {(payloadMatch || respostaMatch) && (
        <section className={styles.bloco}>
          <div className={styles.blocoHeader}>
            <h3 className={styles.blocoTitulo}>JSON do Match</h3>
          </div>

          {payloadMatch && (
            <>
              <p className={styles.jsonLabel}>Payload enviado</p>
              <pre className={styles.jsonBox}>
                {JSON.stringify(payloadMatch, null, 2)}
              </pre>
            </>
          )}

          {respostaMatch && (
            <>
              <p className={styles.jsonLabel}>Resposta da API</p>
              <pre className={styles.jsonBox}>
                {JSON.stringify(respostaMatch, null, 2)}
              </pre>
            </>
          )}
        </section>
      )}

      <div className={styles.avisoRodape}>
        Conectado como {nomeEmpresa}. Rotas protegidas e mapa agregado ativos.
      </div>
    </div>
  )
}
