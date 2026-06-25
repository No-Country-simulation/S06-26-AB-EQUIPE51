import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { criarVaga } from '../services/vagaService'
import styles from '../styles/cadastroVaga.module.css'
import { tratarErroHttp } from "../components/utils/tratarErroHTTP";

const NIVEIS = ['Júnior', 'Pleno', 'Sênior']

const SKILLS_SUGERIDAS = [
  'React', 'Node.js', 'Python', 'Java', 'TypeScript',
  'PostgreSQL', 'Docker', 'AWS', 'Figma', 'SQL',
]

export default function CadastroVaga() {
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState([])
  const [carregando, setCarregando] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  function adicionarSkill(valor) {
    const skill = valor.trim()
    if (!skill || skills.includes(skill)) return
    setSkills((prev) => [...prev, skill])
    setSkillInput('')
  }

  function removerSkill(skill) {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }

  function handleSkillKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      adicionarSkill(skillInput)
    }
  }

  async function onSubmit(dadosFormulario) {
    if (skills.length === 0) {
      toast.error('Adicione ao menos uma skill/requisito.')
      return
    }

    const payload = {
      titulo: dadosFormulario.titulo,
      nivel: dadosFormulario.nivel,
      regiao: dadosFormulario.regiao,
      skills,
    }

    try {
      setCarregando(true)
      await criarVaga(payload)
      toast.success('Vaga cadastrada com sucesso!')
      reset()
      setSkills([])
    } catch (error) {
      toast.error(tratarErroHttp(error));
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className={styles.page}>

    {/* Card branco com o formulário — TUDO igual ao que já existia */}
    <div className={styles.card}>
      <div className={styles.cabecalho}>
        <span className={styles.badge}>InclusiveTech</span>
        <h1 className={styles.titulo}>Cadastro de Vaga</h1>
        <p className={styles.subtitulo}>
          Publique uma vaga e conecte-se a talentos de grupos sub-representados.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>

          {/* Título + Nível */}
          <div className={styles.linha}>
            <div className={styles.grupo}>
              <label className={styles.label}>Título da Vaga *</label>
              <div className={`${styles.inputGroup} ${errors.titulo ? styles['inputGroup--erro'] : ''}`}>
                <input
                  placeholder="Ex: Desenvolvedora Frontend"
                  {...register('titulo', { required: 'Título é obrigatório' })}
                />
              </div>
              {errors.titulo && <span className={styles.erro}>{errors.titulo.message}</span>}
            </div>

            <div className={styles.grupo}>
              <label className={styles.label}>Nível *</label>
              <div className={`${styles.inputGroup} ${errors.nivel ? styles['inputGroup--erro'] : ''}`}>
                <select {...register('nivel', { required: 'Nível é obrigatório' })}>
                  <option value="">Selecione...</option>
                  {NIVEIS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              {errors.nivel && <span className={styles.erro}>{errors.nivel.message}</span>}
            </div>
          </div>

          {/* Região */}
          <div className={styles.grupo}>
            <label className={styles.label}>Região *</label>
            <div className={`${styles.inputGroup} ${errors.regiao ? styles['inputGroup--erro'] : ''}`}>
              <input
                placeholder="Ex: São Paulo - SP"
                {...register('regiao', { required: 'Região é obrigatória' })}
              />
            </div>
            {errors.regiao && <span className={styles.erro}>{errors.regiao.message}</span>}
          </div>

          {/* Skills */}
          <div className={styles.grupo}>
            <label className={styles.label}>Skills / Requisitos Técnicos *</label>
            <p className={styles.dica}>Digite e pressione Enter para adicionar. Clique em sugestões abaixo.</p>

            <div className={styles.skillInputWrapper}>
              <div className={styles.inputGroup}>
                <input
                  placeholder="Ex: React, Node.js..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                />
              </div>
              <button
                type="button"
                className={styles.btnAdicionar}
                onClick={() => adicionarSkill(skillInput)}
              >
                +
              </button>
            </div>

            {/* Tags das skills adicionadas */}
            {skills.length > 0 && (
              <div className={styles.tagsContainer}>
                {skills.map((skill) => (
                  <span key={skill} className={styles.tag}>
                    {skill}
                    <button
                      type="button"
                      className={styles.tagRemover}
                      onClick={() => removerSkill(skill)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Sugestões rápidas */}
            <div className={styles.sugestoesContainer}>
              {SKILLS_SUGERIDAS.filter((s) => !skills.includes(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={styles.sugestao}
                  onClick={() => adicionarSkill(s)}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className={styles.btnSubmit}
          >
            {carregando ? 'Publicando...' : 'Publicar Vaga'}
          </button>
        </form>
      </div>

      <div className={styles.painelLateral}>
      <div className={styles.painelConteudo}>
        <h2>Conecte-se a talentos diversos!</h2>
        <p>Sua vaga pode mudar a trajetória de alguém.</p>
      </div>
    </div>
    
    </div>
  )
}