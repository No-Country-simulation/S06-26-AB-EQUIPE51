// Envolve rotas que exigem autenticação. Se não houver um access token
// válido em memória, redireciona para /login em vez de renderizar a rota.

import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

export default function ProtectedRoute({ children }) {
  const { estaLogado, carregando } = useAuth()

  if (carregando) {
    return <div>Carregando...</div>
  }

  if (!estaLogado) {
    return <Navigate to="/login" replace />
  }

  return children
}