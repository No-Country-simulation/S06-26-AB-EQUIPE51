//Imports
//React router dom para as rotas da aplicação
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

//hot toast para avisos de erro e sucesso
import { Toaster } from "react-hot-toast";

//Páginas principais
import CadastroEmpresa from "./pages/CadastroEmpresa";
import CadastroVaga from "./components/CadastroVaga";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PainelPrincipal from "./pages/PainelPrincipal";

export default function App() {
  return (
    <BrowserRouter>
      {/* Utilizando o toaster para renderizar as notificações, erro e sucesso */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontFamily: "Inter, sans-serif", fontWeight: 500 },
        }}
      />

      {/* Routes, Rota padrão -> tela de cadastro de empresas */}
      <Routes>
        <Route path="/" element={<PainelPrincipal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/empresa/cadastro" element={<CadastroEmpresa />} />
        <Route path="/vagas/cadastro" element={<CadastroVaga />} />
        <Route path="/painel" element={<PainelPrincipal />} />
      </Routes>
    </BrowserRouter>
  );
}
