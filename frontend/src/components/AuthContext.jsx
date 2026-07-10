// src/context/AuthContext.jsx
//
// Centraliza o estado de autenticação da aplicação:
// - usuário logado (dados básicos + role)
// - se a verificação inicial de sessão já terminou
// - funções de login/logout que outros components podem chamar
//
// Por que isso é necessário além do authService.js:
// authService.js guarda o token numa variável "solta" em memória —
// funciona para o Axios, mas componentes React não "escutam" essa
// variável mudar. Com Context, quando o usuário loga ou desloga,
// todo componente que usa o contexto re-renderiza automaticamente.

import { createContext, useContext, useState, useEffect } from "react"
import {
  login as loginService,
  logout as logoutService,
  refresh as refreshService,
} from "../services/authService"

import { buscarUsuarioLogado } from "../services/usuarioLogadoService";
import { getAccessToken } from "../services/tokenStore";

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // dados do usuário logado: { id, nome, email, role } — ou null se deslogado
  const [usuario, setUsuario] = useState(null)

  // true enquanto ainda não sabemos se há sessão válida
  // (evita "flash" de tela de login antes de confirmar)
  const [carregando, setCarregando] = useState(true)

  // Ao montar o app, tenta recuperar a sessão via refresh token (cookie)
  useEffect(() => {
    async function verificarSessao() {
      try {
        // Atualiza o access_token usando o refresh token
        await refreshService();
        //console.log("TOKEN APÓS REFRESH:", getAccessToken());

        // Busca os dados reais do usuário logado
        const usuario = await buscarUsuarioLogado();
        //console.log("USUÁRIO:", usuario);
        // Salva o usuário completo no Context
        setUsuario(usuario);

      } catch (error) {
        //console.error("Sessão inválida:", error);
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    }

    verificarSessao();
  }, []);

  async function login(dados) {
    const response = await loginService(dados);

    const usuario = await buscarUsuarioLogado();

    setUsuario(usuario);

    return response;
  }

  async function logout() {
    try {
      await logoutService();
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    } finally {
      setUsuario(null);
    }
  }

  const valor = {
    usuario,
    role: usuario?.role ?? null,
    estaLogado: !!usuario,
    carregando,
    login,
    logout,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}




// Hook de conveniência — em vez de importar useContext + AuthContext
// em todo lugar, os components só chamam useAuth()
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider")
  }
  return context
}