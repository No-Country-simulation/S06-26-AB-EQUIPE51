// CadastroEmpresa.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { criarEmpresa } from "../services/empresaService";
import TermosUso from "../components/TermosUso";
import PoliticaPrivacidade from "../components/politicaPrivacidade";
import styles from "../styles/cadastroEmpresa.module.css";

const GRUPOS_PRIORITARIOS = [
  { valor: "MULHER", label: "Mulher" },
  { valor: "PCD", label: "Pessoa com deficiência" },
  { valor: "INDIGENA", label: "Indígena" },
  { valor: "LGBTQIA+", label: "LGBTQIA+" },
];

export default function CadastroEmpresa() {
  const [gruposSelecionados, setGruposSelecionados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [termosAbertos, setTermosAbertos] = useState(false);
  const [privacidadeAberta, setPrivacidadeAberta] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  function toggleGrupo(valor) {
    setGruposSelecionados((prev) =>
      prev.includes(valor) ? prev.filter((g) => g !== valor) : [...prev, valor]
    );
  }

  async function onSubmit(dadosFormulario) {
    if (gruposSelecionados.length === 0) {
      toast.error("Selecione ao menos um grupo prioritário.");
      return;
    }

    const payload = {
      nome: dadosFormulario.nome,
      email: dadosFormulario.email,
      senha: dadosFormulario.senha,
      nomeEmpresa: dadosFormulario.nomeEmpresa,
      metaDiversidade: Number(dadosFormulario.metaDiversidade),
      gruposPrioritarios: gruposSelecionados,
    };

    try {
      setCarregando(true);
      await criarEmpresa(payload);
      toast.success("Empresa cadastrada com sucesso!");
      reset();
      setGruposSelecionados([]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={styles.page}>

      <div className={styles.card}>
        <div className={styles.cabecalho}>
          <h1 className={styles.titulo}>Cadastro de Empresa</h1>
          <p className={styles.subtitulo}>
            Preencha os dados para conectar sua empresa a talentos diversos.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>

          <div className={styles.inputGroup}>
            <input
              placeholder="Nome do Responsável"
              {...register("nome", { required: "Nome é obrigatório" })}
            />
          </div>
          {errors.nome && <span className={styles.erro}>{errors.nome.message}</span>}

          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="E-mail"
              {...register("email", {
                required: "E-mail é obrigatório",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "E-mail inválido" },
              })}
            />
          </div>
          {errors.email && <span className={styles.erro}>{errors.email.message}</span>}

          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Senha (mínimo 6 caracteres)"
              {...register("senha", {
                required: "Senha é obrigatória",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
            />
          </div>
          {errors.senha && <span className={styles.erro}>{errors.senha.message}</span>}

          <div className={styles.inputGroup}>
            <input
              placeholder="Nome da Empresa"
              {...register("nomeEmpresa", { required: "Nome da empresa é obrigatório" })}
            />
          </div>
          {errors.nomeEmpresa && <span className={styles.erro}>{errors.nomeEmpresa.message}</span>}

          <div className={styles.inputGroup}>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="Meta de Diversidade (%)"
              {...register("metaDiversidade", {
                required: "Meta é obrigatória",
                min: { value: 0, message: "Mínimo 0%" },
                max: { value: 100, message: "Máximo 100%" },
              })}
            />
          </div>
          {errors.metaDiversidade && <span className={styles.erro}>{errors.metaDiversidade.message}</span>}

          <div className={styles.gruposGrid}>
            {GRUPOS_PRIORITARIOS.map((grupo) => {
              const marcado = gruposSelecionados.includes(grupo.valor)
              return (
                <button
                  key={grupo.valor}
                  type="button"
                  onClick={() => toggleGrupo(grupo.valor)}
                  className={`${styles.chip} ${marcado ? styles.chipMarcado : ""}`}
                >
                  {marcado && <span>✓ </span>}
                  {grupo.label}
                </button>
              )
            })}
          </div>

          {/* Checkbox de termos */}
          <div className={styles.termosRow}>
            <input
              type="checkbox"
              id="aceiteTermos"
              className={styles.checkbox}
              {...register("aceiteTermos", {
                required: "Você precisa aceitar os termos para continuar",
              })}
            />
            <label htmlFor="aceiteTermos" className={styles.termosLabel}>
              Li e concordo com os{" "}
              <button type="button" className={styles.linkTermos} onClick={() => setTermosAbertos(true)}>
                Termos de Uso
              </button>{" "}
              e a{" "}
              <button type="button" className={styles.linkTermos} onClick={() => setPrivacidadeAberta(true)}>
                Política de Privacidade
              </button>
            </label>
          </div>
          {errors.aceiteTermos && <span className={styles.erro}>{errors.aceiteTermos.message}</span>}

          <button type="submit" disabled={carregando} className={styles.botao}>
            {carregando ? "Cadastrando..." : "Cadastrar Empresa"}
          </button>
        </form>

        <p className={styles.login}>
          Já tem uma conta?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>

      <div className={styles.painelLateral}>
        <div className={styles.painelConteudo}>
          <h2>Faça parte da mudança!</h2>
          <p>Cadastre sua empresa e amplie suas metas de diversidade com inteligência artificial.</p>
        </div>
      </div>

      {/* Modais de Termos e Privacidade */}
      <TermosUso aberto={termosAbertos} onFechar={() => setTermosAbertos(false)} />
      <PoliticaPrivacidade aberto={privacidadeAberta} onFechar={() => setPrivacidadeAberta(false)} />

    </div>
  )
}