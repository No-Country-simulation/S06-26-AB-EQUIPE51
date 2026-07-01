// src/components/VagaAfirmativa/VagaAfirmativa.jsx
import { useState } from "react"
import styles from "../../styles/vagaAfirmativa.module.css"

// ⚠️ Estrutura completa de categorias e opções.
// As opções de "Inclusão Socioeconômica" e "Inclusão Humanitária"
// são SUGESTÕES MINHAS — ainda precisam ser validadas/ajustadas por você.
const CATEGORIAS = [
  {
    chave: "genero",
    label: "Gênero",
    descricao: "Mulheres cisgênero e transgênero. O foco principal é a equidade salarial e a ocupação de cargos de alta liderança (gerência, diretoria e conselhos).",
    opcoes: ["Homem", "Mulher"],
  },
  {
    chave: "racaEtnia",
    label: "Raça e Etnia",
    descricao: "Profissionais pretos, pardos e indígenas. As ações buscam corrigir a sub-representação histórica em cargos intelectuais e de gestão.",
    opcoes: ["Branca", "Preta", "Parda", "Indígena", "Amarela"],
  },
  {
    chave: "pcd",
    label: "Pessoas com Deficiência (PCD)",
    descricao: "Profissionais com deficiências físicas, visuais, auditivas, intelectuais, psicossociais ou neurodivergentes (como autismo e TDAH). O foco vai além da cota obrigatória, buscando inclusão real e acessibilidade.",
    opcoes: ["Física", "Visual", "Auditiva", "Intelectual", "Psicossocial", "Neurodivergente"],
  },
  {
    chave: "lgbtqia",
    label: "Comunidade LGBTQIA+",
    descricao: "Lésbicas, gays, bissexuais, transgêneros, travestis, queer, intersexo, assexuais e demais identidades. Prioriza-se a criação de um ambiente seguro e a empregabilidade de pessoas trans e travestis.",
    opcoes: ["Lésbica", "Gay", "Bissexual", "Transgênero", "Travesti", "Queer", "Intersexo", "Assexual"],
  },
  {
    chave: "geracional",
    label: "Geracional (50+)",
    descricao: "Profissionais seniores com mais de 50 ou 60 anos. O objetivo é combater o etarismo, valorizar a experiência e promover a troca de conhecimento com gerações mais jovens.",
    opcoes: ["50 a 59 anos", "60 anos ou mais"],
  },
  {
    chave: "socioeconomica",
    label: "Inclusão Socioeconômica",
    // ⚠️ SUGESTÃO MINHA — validar com o time
    descricao: "Profissionais oriundos de contextos de baixa renda ou vulnerabilidade socioeconômica, incluindo primeira geração da família no ensino superior e beneficiários de programas sociais.",
    opcoes: ["Baixa renda", "Primeira geração universitária", "Beneficiário de programa social", "Egresso do sistema prisional"],
  },
  {
    chave: "humanitaria",
    label: "Inclusão Humanitária",
    // ⚠️ SUGESTÃO MINHA — validar com o time
    descricao: "Pessoas refugiadas, solicitantes de refúgio, imigrantes em situação de vulnerabilidade ou em condição de apatridia.",
    opcoes: ["Refugiado(a)", "Solicitante de refúgio", "Imigrante em vulnerabilidade", "Apátrida"],
  },
]

const MAX_CATEGORIAS = 2

export default function VagaAfirmativa({ onChange }) {
  const [vagaAfirmativa, setVagaAfirmativa] = useState(false)
  const [selecoes, setSelecoes] = useState({}) // { genero: "Mulher", pcd: "Visual" }
  const [categoriaInfo, setCategoriaInfo] = useState(null) // controla qual popup de descrição está aberto

  const categoriasPreenchidas = Object.keys(selecoes).length

  function selecionarOpcao(categoriaChave, opcao) {
    setSelecoes(prev => {
      const novo = { ...prev }

      // se já está marcada essa opção, clicar de novo desmarca (toggle)
      if (novo[categoriaChave] === opcao) {
        delete novo[categoriaChave]
        onChange?.(novo)
        return novo
      }

      // se a categoria ainda não tem nada marcado, mas já bateu o limite de categorias
      const categoriaJaTemAlgo = categoriaChave in novo
      if (!categoriaJaTemAlgo && categoriasPreenchidas >= MAX_CATEGORIAS) {
        return prev // não permite adicionar uma 3ª categoria
      }

      novo[categoriaChave] = opcao // substitui a opção anterior da mesma categoria, se houver
      onChange?.(novo)
      return novo
    })
  }

  return (
    <div className={styles.wrapper}>

      <div className={styles.checkboxRow}>
        <input
          type="checkbox"
          id="vagaAfirmativa"
          className={styles.checkbox}
          checked={vagaAfirmativa}
          onChange={(e) => setVagaAfirmativa(e.target.checked)}
        />
        <label htmlFor="vagaAfirmativa" className={styles.checkboxLabel}>
          Esta é uma vaga afirmativa
        </label>
      </div>

      {vagaAfirmativa && (
        <div className={styles.expansao}>
          <p className={styles.aviso}>
            Selecione até {MAX_CATEGORIAS} categorias de diversidade prioritárias para esta vaga.
            Apenas uma opção por categoria pode ser marcada.
          </p>
          <p className={styles.contador}>
            {categoriasPreenchidas} de {MAX_CATEGORIAS} categorias selecionadas
          </p>

          <div className={styles.listaCategorias}>
            {CATEGORIAS.map(categoria => {
              const desabilitada =
                categoriasPreenchidas >= MAX_CATEGORIAS && !(categoria.chave in selecoes)

              return (
                <div
                  key={categoria.chave}
                  className={`${styles.categoriaBloco} ${desabilitada ? styles.categoriaDesabilitada : ""}`}
                >
                  <div className={styles.categoriaHeader}>
                    <span className={styles.categoriaTitulo}>{categoria.label}</span>
                    <button
                      type="button"
                      className={styles.btnInfo}
                      onClick={() => setCategoriaInfo(categoria)}
                      aria-label={`Saiba mais sobre ${categoria.label}`}
                    >
                      i
                    </button>
                  </div>

                  <div className={styles.opcoesRow}>
                    {categoria.opcoes.map(opcao => {
                      const marcada = selecoes[categoria.chave] === opcao
                      return (
                        <button
                          key={opcao}
                          type="button"
                          disabled={desabilitada && !marcada}
                          onClick={() => selecionarOpcao(categoria.chave, opcao)}
                          className={`${styles.opcaoChip} ${marcada ? styles.opcaoMarcada : ""}`}
                        >
                          {marcada && "✓ "}
                          {opcao}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Popup de descrição da categoria */}
      {categoriaInfo && (
        <div className={styles.popupOverlay} onClick={() => setCategoriaInfo(null)}>
          <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupHeader}>
              <strong>{categoriaInfo.label}</strong>
              <button
                type="button"
                className={styles.popupFechar}
                onClick={() => setCategoriaInfo(null)}
              >
                ✕
              </button>
            </div>
            <p className={styles.popupTexto}>{categoriaInfo.descricao}</p>
          </div>
        </div>
      )}

    </div>
  )
}