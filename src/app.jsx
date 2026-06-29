// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// O AuthProvider agora cuida de tudo que antes estava aqui:
// useState(verificandoSessao), useEffect, chamada de refresh().
// Por isso removemos os imports de useState/useEffect/refresh.
import { AuthProvider, useAuth } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas principais
import CadastroEmpresa from "./pages/CadastroEmpresa";
import CadastroVaga from "./components/CadastroVaga";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PainelPrincipal from "./pages/PainelPrincipal";

// Componente separado só para poder usar o hook useAuth()
// (não dá pra usar o hook no mesmo componente que declara o Provider,
// porque o Provider ainda não "existe" no momento em que o App roda)
function AppRotas() {
  const { carregando } = useAuth();

  // mesma ideia de antes: enquanto não sabemos se há sessão válida,
  // não renderiza as rotas ainda
  if (carregando) {
    return <div>Carregando...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<PainelPrincipal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/empresa/cadastro" element={<CadastroEmpresa />} />
      <Route path="/vagas/cadastro" element={<CadastroVaga />} />

      {/* agora protegida pelo RotaProtegida, que usa o Context */}
      <Route
        path="/painel"
        element={
          <ProtectedRoute>
            <PainelPrincipal />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider precisa envolver tudo que for usar useAuth(),
          incluindo o AppRotas e qualquer página/componente que
          precise saber se o usuário está logado ou qual é a role dele */}
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
  );
}