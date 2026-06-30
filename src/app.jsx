import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import { AuthProvider } from "./components/AuthContext"
import CadastroVaga from "./components/CadastroVaga"
import CadastroEmpresa from "./pages/CadastroEmpresa"
import Login from "./pages/Login"
import PainelPrincipal from "./pages/PainelPrincipal"

function AppRotas() {
  return (
    <Routes>
      <Route path="/" element={<PainelPrincipal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/empresa/cadastro" element={<CadastroEmpresa />} />
      <Route path="/vagas/cadastro" element={<CadastroVaga />} />
      <Route path="/painel" element={<PainelPrincipal />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontFamily: "Inter, sans-serif", fontWeight: 500 },
          }}
        />
        <AppRotas />
      </AuthProvider>
    </BrowserRouter>
  )
}
