import React from 'react';
export default function ErrorMessage({ mensagem, tentarNovamente }) {
  return (
    <div className="estado estado-erro">
      <div className="estado-icone">!</div>
      <h3>Ocorreu um erro</h3>
      <p>{mensagem}</p>
      {tentarNovamente && (
        <button className="btn btn-primario" onClick={tentarNovamente}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
