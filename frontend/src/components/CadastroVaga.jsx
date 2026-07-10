import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { criarVaga } from "../services/vagaService";
import styles from "../styles/cadastroVaga.module.css";
import { tratarErroHttp } from "../components/utils/tratarErroHTTP";
import VagaAfirmativa from "./PainelPrincipalComponents/VagaAfirmativa";
import { buscarEmpresaLogadaId } from "../services/usuarioLogadoService";

const NIVEIS = ["Júnior", "Pleno", "Sênior"];

const SKILLS_SUGERIDAS = [
  "React",
  "Node.js",
  "Python",
  "Java",
  "TypeScript",
  "PostgreSQL",
  "Docker",
  "AWS",
  "Figma",
  "SQL",
];

const CARGOS = [
  { label: "Frontend Developer", value: "FRONTEND_DEVELOPER" },
  { label: "Backend Developer", value: "BACKEND_DEVELOPER" },
  { label: "Fullstack Developer", value: "FULLSTACK_DEVELOPER" },
  { label: "Mobile Developer", value: "MOBILE_DEVELOPER" },
  { label: "Data Analyst", value: "DATA_ANALYST" },
  { label: "Data Engineer", value: "DATA_ENGINEER" },
  { label: "DevOps Engineer", value: "DEVOPS_ENGINEER" },
  { label: "QA Engineer", value: "QA_ENGINEER" },
  { label: "UX Designer", value: "UX_DESIGNER" },
  { label: "Product Manager", value: "PRODUCT_MANAGER" },
];


export default function CadastroVaga() {
  const navigate = useNavigate();
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [diversidadeSelecionada, setDiversidadeSelecionada] = useState({}); // ← novo estado

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  function adicionarSkill(valor) {
    const skill = valor.trim();
    if (!skill || skills.includes(skill)) return;
    setSkills((prev) => [...prev, skill]);
    setSkillInput("");
  }

  function removerSkill(skill) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  function handleSkillKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      adicionarSkill(skillInput);
    }
  }

  async function onSubmit(dadosFormulario) {

    if (skills.length === 0) {
      toast.error("Adicione ao menos uma skill.");
      return;
    }

    const empresaId = await buscarEmpresaLogadaId();

    if (!empresaId) {
      toast.error("Empresa não encontrada.");
      return;
    }

    const mapaNivel = {
      "Júnior": "JUNIOR",
      "Pleno": "PLENO",
      "Sênior": "SENIOR",
    };


    const cargoSelecionado = CARGOS.find(
      c => c.value === dadosFormulario.cargo
    );

    if (!cargoSelecionado) {
      toast.error("Selecione um cargo.");
      return;
    }
    const MODALIDADES = [
      "PRESENCIAL",
      "HIBRIDO",
      "REMOTO",
    ];

    const payload = {
      empresaId,

      titulo: cargoSelecionado.label,

      cargo: cargoSelecionado.value,

      modalidade: dadosFormulario.modalidade,

      nivel: mapaNivel[dadosFormulario.nivel],

      regiao: dadosFormulario.regiao,

      skills,
    };

    try {
      setCarregando(true);
      console.log("Payload da vaga:", payload);
      await criarVaga(payload);
      toast.success("Vaga cadastrada com sucesso!");
      reset({
        cargo: "",
        nivel: "",
        modalidade: "",
        regiao: "",
      });
      setSkillInput("");
      setDiversidadeSelecionada({});
      setSkills([]);
    } catch (error) {
      toast.error(tratarErroHttp(error));
    } finally {
      setCarregando(false);
    }
  }
  

  return (
    <>
    <div className={styles.page}>
    <button
          type="button"
          className={styles.btnVoltar}
          onClick={() => navigate("/painel")}
        >
          Voltar
        </button>
    <div className={styles.pageContent}>
        <div className={styles.card}>
          <div className={styles.cabecalho}>
            <span className={styles.badge}>InclusiveTech</span>
            <h1 className={styles.titulo}>Cadastro de Vaga</h1>
            <p className={styles.subtitulo}>
              Publique uma vaga e conecte-se a talentos de grupos
              sub-representados.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.form}
            noValidate
          >
            {/* Título + Nível */}
            <div className={styles.linha}>
              <div className={styles.grupo}>
                <label className={styles.label}>Título do Cargo *</label>
                <div
                  className={`${styles.inputGroup} ${
                    errors.cargo ? styles["inputGroup--erro"] : ""
                  }`}
                >
                  <select
                    {...register("cargo", {
                      required: "Cargo é obrigatório",
                    })}
                  >
                    <option value="">Selecione...</option>

                    {CARGOS.map((cargo) => (
                      <option key={cargo.value} value={cargo.value}>
                        {cargo.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.cargo && (
                  <span className={styles.erro}>{errors.cargo.message}</span>
                )}
              </div>

              <div className={styles.grupo}>
                <label className={styles.label}>Nível *</label>
                <div
                  className={`${styles.inputGroup} ${
                    errors.nivel ? styles["inputGroup--erro"] : ""
                  }`}
                >
                  <select
                    {...register("nivel", { required: "Nível é obrigatório" })}
                  >
                    <option value="">Selecione...</option>
                    {NIVEIS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.nivel && (
                  <span className={styles.erro}>{errors.nivel.message}</span>
                )}
              </div>
            </div>
            <div className={styles.grupo}>
              <label className={styles.label}>Modalidade *</label>

              <div className={styles.inputGroup}>
                <select
                  {...register("modalidade", {
                    required: "Modalidade é obrigatória",
                  })}
                  defaultValue="HIBRIDO"
                >
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="HIBRIDO">Híbrido</option>
                  <option value="REMOTO">Remoto</option>
                </select>
              </div>

              {errors.modalidade && (
                <span className={styles.erro}>
                  {errors.modalidade.message}
                </span>
              )}
            </div>  

            {/* Região */}
            <div className={styles.grupo}>
              <label className={styles.label}>Região *</label>
              <div
                className={`${styles.inputGroup} ${
                  errors.regiao ? styles["inputGroup--erro"] : ""
                }`}
              >
                <input
                  placeholder="Ex: São Paulo - SP"
                  {...register("regiao", { required: "Região é obrigatória" })}
                />
              </div>
              {errors.regiao && (
                <span className={styles.erro}>{errors.regiao.message}</span>
              )}
            </div>

            {/* Skills */}
            <div className={styles.grupo}>
              <label className={styles.label}>
                Skills / Requisitos Técnicos *
              </label>
              <p className={styles.dica}>
                Digite e pressione Enter para adicionar. Clique em sugestões
                abaixo.
              </p>

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

              <div className={styles.sugestoesContainer}>
                {SKILLS_SUGERIDAS.filter((s) => !skills.includes(s)).map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      className={styles.sugestao}
                      onClick={() => adicionarSkill(s)}
                    >
                      + {s}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Vaga afirmativa — novo bloco, encaixado antes do botão de enviar */}
            <VagaAfirmativa onChange={setDiversidadeSelecionada} />

            <button
              type="submit"
              disabled={carregando}
              className={styles.btnSubmit}
            >
              {carregando ? "Publicando..." : "Publicar Vaga"}
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
    </div>
    </>
  );
}
