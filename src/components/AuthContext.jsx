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
        await refreshService()
        // ⚠️ ajustar conforme o formato real da resposta do backend —
        // supondo que /auth/refresh também devolva os dados do usuário
        setUsuario({
          autenticado: true,
        })
      } catch {
        setUsuario(null)
      } finally {
        setCarregando(false)
      }
    }
    verificarSessao()
  }, [])

  async function login(dados) {
    const response = await loginService(dados)
    // Se o login deu certo, existe um access_token.
    // Então já consideramos o usuário autenticado.
    setUsuario({
      autenticado: true
    })
    return response
  }

  async function logout() {
    await logoutService()
    setUsuario(null)
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