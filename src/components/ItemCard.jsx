import React from 'react';
import { Link } from "react-router-dom";

export default function ItemCard({ item }) {
  const devolvido = item.status === "devolvido";

  return (
    <article className="item-card">
      <div className="item-icone">📦</div>

      <div className="item-info">
        <div className="item-cabecalho">
          <h3>{item.nome}</h3>
          <span className={`status ${devolvido ? "devolvido" : "aguardando"}`}>
            {devolvido ? "Devolvido" : "Aguardando"}
          </span>
        </div>

        <p className="descricao">
          {item.descricao || "Sem descrição informada."}
        </p>

        <div className="metadados">
          <span>🏷️ {item.categoria || "Sem categoria"}</span>
          <span>📍 {item.local || "Local não informado"}</span>
          <span>📅 {formatarData(item.data_encontrado)}</span>
        </div>
      </div>

      <Link to={`/item/${item.id}`} className="btn btn-secundario">
        Ver detalhes
      </Link>
    </article>
  );
}

function formatarData(data) {
  if (!data) return "Data não informada";
  const [ano, mes, dia] = data.split("-");
  if (!ano || !mes || !dia) return data;
  return `${dia}/${mes}/${ano}`;
}
