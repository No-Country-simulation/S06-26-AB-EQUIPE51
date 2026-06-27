import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
//import { login } from "../services/authService";
import { useAuth } from "../components/AuthContext";
import styles from "../styles/login.module.css";
import { tratarErroHttp } from "../components/utils/tratarErroHTTP";

const Login = () => {
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();


  const { login } = useAuth(); //Novo

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(dados) {
    try {
      setCarregando(true);
      await login(dados); // { email, senha } — já bate com o backend
      toast.success("Login realizado com sucesso!");
      navigate("/painel"); // ajusta para a rota real do seu painel
    } catch (error) {
      toast.error(tratarErroHttp(error));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <div className={styles.page}>
        {/* Card branco — formulário idêntico ao que já existia */}
        <div className={styles.card}>
          <div className={styles.titulo}>
            <h2>Login</h2>
            <p className={styles.subtitle}>Bem vindo de volta!</p>
            <p className={styles.desc}>Gerencie suas vagas e metas ESG</p>
          </div>

          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Email:"
                {...register("email", {
                  required: "E-mail é obrigatório",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "E-mail inválido",
                  },
                })}
              />
            </div>
            {errors.email && (
              <span className={styles.erro}>{errors.email.message}</span>
            )}

            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Senha:"
                {...register("senha", {
                  required: "Senha é obrigatória",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
              />
            </div>
            {errors.senha && (
              <span className={styles.erro}>{errors.senha.message}</span>
            )}

            <button
              type="submit"
              className={styles.btnLogin}
              disabled={carregando}
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <p className={styles.register}>
            Não tem uma conta?{" "}
            <Link to="/empresa/cadastro">Cadastrar empresa</Link>
          </p>
        </div>

        {/* Painel azul decorativo — novo, só visual */}
        <div className={styles.painelLateral}>
          <h2 className={styles.painelTitulo}>Bem-vindo!</h2>
          <p className={styles.painelTexto}>
            Entre e continue conectando talentos diversos a oportunidades reais.
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;