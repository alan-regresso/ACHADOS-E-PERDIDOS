import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { buscarItem, devolverItem, excluirItem } from "../services/itemService";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import Confirmacao from "../components/Confirmacao";

export default function DetalheItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [devolvendo, setDevolvendo] = useState(false);
  const [nomeRecebedor, setNomeRecebedor] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    carregarItem();
  }, [id]);

  async function carregarItem() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await buscarItem(id);
      setItem(resposta.data);
    } catch (error) {
      setErro(error.response?.data?.detail || "Não foi possível carregar o item.");
    } finally {
      setCarregando(false);
    }
  }

  async function confirmarDevolucao(event) {
    event.preventDefault();

    if (!nomeRecebedor.trim()) {
      setMensagem("Informe o nome de quem recebeu o item.");
      return;
    }

    setDevolvendo(true);
    setMensagem("");

    try {
      const resposta = await devolverItem(id, nomeRecebedor.trim());
      setItem(resposta.data);
      setNomeRecebedor("");
      setMensagem("Item marcado como devolvido com sucesso.");
    } catch (error) {
      setMensagem(error.response?.data?.detail || "Não foi possível devolver o item.");
    } finally {
      setDevolvendo(false);
    }
  }

  async function excluir() {
    setExcluindo(true);

    try {
      await excluirItem(id);
      navigate("/");
    } catch (error) {
      setMensagem(error.response?.data?.detail || "Não foi possível excluir o item.");
      setConfirmandoExclusao(false);
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando) return <Loading texto="Carregando item..." />;

  if (erro) {
    return <ErrorMessage mensagem={erro} tentarNovamente={carregarItem} />;
  }

  if (!item) return null;

  const devolvido = item.status === "devolvido";

  return (
    <section className="detalhe-page">
      <Link to="/" className="voltar">← Voltar</Link>

      <div className="detalhe-card">
        <div className="detalhe-capa">
          <span>📦</span>
        </div>

        <div className="detalhe-conteudo">
          <div className="detalhe-topo">
            <div>
              <span className={`status ${devolvido ? "devolvido" : "aguardando"}`}>
                {devolvido ? "Devolvido" : "Aguardando"}
              </span>
              <h1>{item.nome}</h1>
            </div>
          </div>

          <div className="detalhe-grid">
            <Info titulo="Descrição" valor={item.descricao || "Não informado"} />
            <Info titulo="Categoria" valor={item.categoria || "Não informado"} />
            <Info titulo="Local" valor={item.local || "Não informado"} />
            <Info titulo="Encontrado em" valor={formatarData(item.data_encontrado)} />
            <Info titulo="Devolvido para" valor={item.devolvido_para || "Ainda não devolvido"} />
            <Info titulo="Data da devolução" valor={formatarData(item.data_devolucao)} />
          </div>

          {mensagem && <div className="mensagem">{mensagem}</div>}

          {!devolvido && (
            <form className="devolucao" onSubmit={confirmarDevolucao}>
              <h2>Marcar como devolvido</h2>
              <p>Informe o nome de quem recebeu o objeto.</p>
              <div className="linha-form">
                <input
                  value={nomeRecebedor}
                  onChange={(event) => setNomeRecebedor(event.target.value)}
                  placeholder="Nome de quem recebeu"
                />
                <button className="btn btn-primario" disabled={devolvendo}>
                  {devolvendo ? "Confirmando..." : "Confirmar"}
                </button>
              </div>
            </form>
          )}

          <div className="acoes">
            <Link to={`/editar/${item.id}`} className="btn btn-primario">
              Editar
            </Link>
            <button
              className="btn btn-perigo"
              onClick={() => setConfirmandoExclusao(true)}
              disabled={excluindo}
            >
              Excluir
            </button>
          </div>
        </div>
      </div>

      {confirmandoExclusao && (
        <Confirmacao
          mensagem="Tem certeza que deseja excluir este item?"
          confirmar={excluir}
          cancelar={() => setConfirmandoExclusao(false)}
        />
      )}
    </section>
  );
}

function Info({ titulo, valor }) {
  return (
    <div className="info">
      <span>{titulo}</span>
      <strong>{valor}</strong>
    </div>
  );
}

function formatarData(data) {
  if (!data) return "Não informado";
  const [ano, mes, dia] = data.split("-");
  if (!ano || !mes || !dia) return data;
  return `${dia}/${mes}/${ano}`;
}
