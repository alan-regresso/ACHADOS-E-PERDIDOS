export default function Confirmacao({ mensagem, confirmar, cancelar }) {
  return (
    <div className="modal-fundo">
      <div className="modal">
        <div className="modal-icone">!</div>
        <h2>Confirmação</h2>
        <p>{mensagem}</p>
        <div className="modal-acoes">
          <button className="btn btn-perigo" onClick={confirmar}>
            Excluir
          </button>
          <button className="btn btn-secundario" onClick={cancelar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
