// Dashboard.jsx
import { useState } from 'react'
import styles from '../../styles/dashboard.module.css'

// dados mock — troque pelos dados reais da API quando estiver pronta
const METRICAS = [
  { label: 'Vagas da Empresa', valor: 3, cor: 'azul', desc: 'retorno autorizado do backend' },
  { label: 'Matches Realizados', valor: 0, cor: 'verde', desc: 'gere um match para visualizar' },
  { label: 'Meta ESG Atingida', valor: '45%', cor: 'roxo', desc: 'configurada na empresa logada' },
  { label: 'Diversidade Atual', valor: '0%', cor: 'laranja', desc: 'gere um match para calcular' },
  { label: 'Talentos no Match', valor: 0, cor: 'verdeClaro', desc: 'gere um match para visualizar' },
]

const VAGAS = [
  { titulo: 'ANALISTA DE DADOS', nivel: 'JUNIOR', regiao: 'FLORIANOPOLIS', skills: 'SQL' },
  { titulo: 'Analista de Dados', nivel: 'PLENO', regiao: 'Florianopolis', skills: 'Python, SQL, Power BI' },
  { titulo: 'UX Designer', nivel: 'JUNIOR', regiao: 'São Paulo', skills: 'Figma, UX Research, Design System' },
]

const GRUPOS_DISPONIVEIS = ['MULHER', 'PCD', 'NEGRO', 'INDIGENA', 'LGBTQIA+']

export default function Dashboard() {
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState([])
  const [gruposSelecionados, setGruposSelecionados] = useState(['MULHER', 'LGBTQIA+'])
  const [diversidadeMinima, setDiversidadeMinima] = useState(40)

  function adicionarSkill() {
    const skill = skillInput.trim()
    if (!skill || skills.includes(skill)) return
    setSkills(prev => [...prev, skill])
    setSkillInput('')
  }

  function toggleGrupo(grupo) {
    setGruposSelecionados(prev =>
      prev.includes(grupo) ? prev.filter(g => g !== grupo) : [...prev, grupo]
    )
  }

  return (
    <div className={styles.dashboard}>

      {/* Cabeçalho */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.titulo}>Dashboard da Empresa</h1>
          <p className={styles.subtitulo}>Veja apenas dados da empresa logada, vagas e matches autorizados.</p>
        </div>
        <button className={styles.btnOpcoes}>Opções ▾</button>
      </header>

      {/* Saudação */}
      <section className={styles.saudacao}>
        <h2>Olá, recrutador</h2>
        <p>Vaga, match e talentos conectados ao backend.</p>
      </section>

      {/* Métricas */}
      <section className={styles.metricasGrid}>
        {METRICAS.map(m => (
          <div key={m.label} className={styles.metricaCard}>
            <div className={`${styles.metricaIcone} ${styles[m.cor]}`} />
            <span className={styles.metricaLabel}>{m.label}</span>
            <strong className={styles.metricaValor}>{m.valor}</strong>
            <span className={styles.metricaDesc}>{m.desc}</span>
          </div>
        ))}
      </section>

      {/* Conteúdo principal: vagas + form + matches | coluna direita */}
      <div className={styles.corpo}>

        <div className={styles.colunaPrincipal}>

          {/* Últimas vagas */}
          <section className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Últimas 5 vagas</h3>
            <p className={styles.blocoSubtitulo}>Vagas retornadas pela API apenas para a empresa logada.</p>

            <div className={styles.listaVagas}>
              {VAGAS.map(vaga => (
                <div key={vaga.titulo} className={styles.vagaItem}>
                  <div>
                    <strong className={styles.vagaTitulo}>{vaga.titulo}</strong>
                    <p className={styles.vagaInfo}>{vaga.nivel} | {vaga.regiao}</p>
                    <p className={styles.vagaSkills}>{vaga.skills}</p>
                  </div>
                  <button className={styles.btnGerarMatch}>Gerar match</button>
                </div>
              ))}
            </div>
          </section>

          <div className={styles.duasColunas}>

            {/* Criar nova vaga */}
            <section className={styles.bloco}>
              <h3 className={styles.blocoTitulo}>Criar Nova Vaga</h3>

              <label className={styles.label}>Título da Vaga</label>
              <input className={styles.input} placeholder="Ex: Analista de Dados" />

              <label className={styles.label}>Skills</label>
              <div className={styles.skillRow}>
                <input
                  className={styles.input}
                  placeholder="Adicionar skill"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && adicionarSkill()}
                />
                <button className={styles.btnAdd} onClick={adicionarSkill}>+ Add</button>
              </div>
              {skills.length > 0 && (
                <div className={styles.tagsContainer}>
                  {skills.map(s => <span key={s} className={styles.tag}>{s}</span>)}
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

              <label className={styles.label}>Diversidade mínima desejada</label>
              <input
                type="range"
                min="0" max="100"
                value={diversidadeMinima}
                onChange={e => setDiversidadeMinima(e.target.value)}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span>0%</span><span>{diversidadeMinima}%</span><span>100%</span>
              </div>

              <label className={styles.label}>Grupos Prioritários</label>
              <div className={styles.gruposGrid}>
                {GRUPOS_DISPONIVEIS.map(grupo => (
                  <button
                    key={grupo}
                    type="button"
                    onClick={() => toggleGrupo(grupo)}
                    className={`${styles.chip} ${gruposSelecionados.includes(grupo) ? styles.chipMarcado : ''}`}
                  >
                    {grupo}
                  </button>
                ))}
              </div>

              <div className={styles.botoesForm}>
                <button className={styles.btnPublicar}>+ Publicar</button>
                <button className={styles.btnGerarMatchPrincipal}>Gerar Match</button>
              </div>
            </section>

            {/* Melhores matches */}
            <section className={styles.bloco}>
              <div className={styles.blocoHeaderFlex}>
                <h3 className={styles.blocoTitulo}>Melhores Matches</h3>
                <span className={styles.badgeSemMatch}>Sem match</span>
              </div>
              <p className={styles.avisoLgpd}>
                Observação LGPD: exibimos nome, skills e score necessários para o recrutamento. Dados sensíveis ficam protegidos pelo backend.
              </p>
              <div className={styles.semDados}>
                Nenhum candidato exibido. Gere um match para ver apenas resultados autorizados da empresa logada.
              </div>
            </section>

          </div>
        </div>

        {/* Coluna direita */}
        <aside className={styles.colunaDireita}>

          <section className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Mapa de Talentos</h3>
            <div className={styles.mapaPlaceholder}>Mapa aqui</div>
            <p className={styles.mapaDesc}>
              Dados agregados autorizados para a empresa logada. Nenhum dado pessoal de candidato é exibido.
            </p>
          </section>

          <section className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Empresa Logada</h3>
            <p className={styles.infoLinha}>Nome: <strong>Inova Brasil</strong></p>
            <p className={styles.infoLinha}>Meta ESG: <strong>45%</strong></p>
            <p className={styles.infoLinha}>Grupos: <strong>MULHER, LGBTQIA+</strong></p>
          </section>

          <section className={styles.blocoDestaque}>
            <h3 className={styles.blocoTituloDestaque}>✓ Impacto ESG</h3>
            <strong className={styles.impactoValor}>45%</strong>
            <p className={styles.impactoDesc}>meta de diversidade configurada para a empresa logada.</p>
          </section>

        </aside>
      </div>
    </div>
  )
}
