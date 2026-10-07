import React from 'react';
export default function Loading({ texto = "Carregando..." }) {
  return (
    <div className="estado">
      <div className="spinner"></div>
      <strong>{texto}</strong>
    </div>
  );
}
