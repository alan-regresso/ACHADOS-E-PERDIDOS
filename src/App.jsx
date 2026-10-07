import React from "react";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Inicio from "./pages/Inicio";
import DetalheItem from "./pages/DetalheItem";
import FormularioItem from "./pages/FormularioItem";
import { getEu } from "./services/euService";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [erroUsuario, setErroUsuario] = useState("");

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const resposta = await getEu();
        setUsuario(resposta.data);
      } catch {
        setErroUsuario("Não foi possível carregar seus dados.");
      }
    }

    carregarUsuario();
  }, []);

  return (
    <Layout usuario={usuario} erroUsuario={erroUsuario}>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/item/:id" element={<DetalheItem />} />
        <Route path="/novo" element={<FormularioItem modo="novo" />} />
        <Route path="/editar/:id" element={<FormularioItem modo="editar" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
