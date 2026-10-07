import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Layout({ usuario, erroUsuario, children }) {
  const nome = usuario?.nome || "Aluno";

  return (
    <div className="app">
      <header className="topo">
        <div className="topo-inner">
          <Link to="/" className="marca">
            <span className="marca-icone">🔎</span>
            <span>
              <strong>Achados & Perdidos</strong>
              <small>IFRN • Campus Pau dos Ferros</small>
            </span>
          </Link>

          <nav className="nav">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "nav-link ativo" : "nav-link")}
            >
              Início
            </NavLink>
            <NavLink
              to="/novo"
              className={({ isActive }) => (isActive ? "nav-link ativo" : "nav-link")}
            >
              Novo item
            </NavLink>
          </nav>

          <div className="usuario">
            <span className="avatar">{nome.charAt(0).toUpperCase()}</span>
            <div>
              <small>Olá,</small>
              <strong>{nome}</strong>
            </div>
          </div>
        </div>
      </header>

      {erroUsuario && <div className="aviso-topo">{erroUsuario}</div>}

      <main className="conteudo">{children}</main>

      <footer className="rodape">
        <span>Achados & Perdidos IFRN</span>
        <span>React + Vite</span>
      </footer>
    </div>
  );
}
