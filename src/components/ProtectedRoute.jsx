// Envolve rotas que exigem autenticação. Se não houver um access token
// válido em memória, redireciona para /login em vez de renderizar a rota.

import { Navigate } from "react-router-dom"
import { getAccessToken } from "../services/authService"

export default function ProtectedRoute({ children }) {
  const token = getAccessToken()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}