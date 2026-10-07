import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { buscarItem, criarItem, atualizarItem } from "../services/itemService";
import { listarCategorias, listarLocais } from "../services/opcoesService";
import Loading from "../components/Loading";

const estadoInicial = {
  nome: "",
  descricao: "",
  categoria: "",
  local: "",
  data_encontrado: ""
};

export default function FormularioItem({ modo }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = modo === "editar";

  const [formulario, setFormulario] = useState(estadoInicial);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);
  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    carregarOpcoes();
  }, []);

  useEffect(() => {
    if (editando) carregarItem();
  }, [editando, id]);

  async function carregarOpcoes() {
    try {
      const [categoriasResposta, locaisResposta] = await Promise.all([
        listarCategorias(),
        listarLocais()
      ]);

      setCategorias(normalizarLista(categoriasResposta.data));
      setLocais(normalizarLista(locaisResposta.data));
    } catch {
      setErro("Não foi possível carregar categorias e locais.");
    }
  }

  async function carregarItem() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await buscarItem(id);
      const item = resposta.data;

      setFormulario({
        nome: item.nome || "",
        descricao: item.descricao || "",
        categoria: item.categoria || "",
        local: item.local || "",
        data_encontrado: item.data_encontrado || ""
      });
    } catch (error) {
      setErro(error.response?.data?.detail || "Não foi possível carregar o item.");
    } finally {
      setCarregando(false);
    }
  }

  function alterarCampo(event) {
    const { name, value } = event.target;

    setFormulario((atual) => ({
      ...atual,
      [name]: value
    }));
  }

  async function salvar(event) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    if (
      !formulario.nome.trim() ||
      !formulario.descricao.trim() ||
      !formulario.categoria ||
      !formulario.local ||
      !formulario.data_encontrado
    ) {
      setErro("Preencha todos os campos.");
      return;
    }

    setSalvando(true);

    try {
      if (editando) {
        await atualizarItem(id, formulario);
        setSucesso("Item atualizado com sucesso.");
      } else {
        const resposta = await criarItem(formulario);
        setSucesso("Item cadastrado com sucesso.");
        setFormulario(estadoInicial);

        setTimeout(() => {
          navigate(`/item/${resposta.data.id}`);
        }, 500);
      }
    } catch (error) {
      const detalhe = error.response?.data?.detail;
      setErro(
        Array.isArray(detalhe)
          ? detalhe.map((item) => item.msg || item).join(" ")
          : detalhe || "Não foi possível salvar o item."
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <Loading texto="Carregando formulário..." />;

  return (
    <section className="form-page">
      <Link to={editando ? `/item/${id}` : "/"} className="voltar">
        ← Voltar
      </Link>

      <div className="pagina-titulo">
        <div>
          <span className="eyebrow">CADASTRO</span>
          <h1>{editando ? "Editar item" : "Novo item"}</h1>
          <p>
            {editando
              ? "Atualize as informações do item encontrado."
              : "Registre um objeto encontrado no campus."}
          </p>
        </div>
      </div>

      <form className="form-card" onSubmit={salvar}>
        <div className="form-grid">
          <div className="campo campo-largo">
            <label htmlFor="nome">Nome do item</label>
            <input
              id="nome"
              name="nome"
              value={formulario.nome}
              onChange={alterarCampo}
              placeholder="Ex.: Garrafa preta"
            />
          </div>

          <div className="campo campo-largo">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formulario.descricao}
              onChange={alterarCampo}
              placeholder="Descreva características que ajudam a identificar o item..."
              rows="5"
            />
          </div>

          <div className="campo">
            <label htmlFor="categoria">Categoria</label>
            <select
              id="categoria"
              name="categoria"
              value={formulario.categoria}
              onChange={alterarCampo}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((categoria, index) => (
                <option key={index} value={valorOpcao(categoria)}>
                  {textoOpcao(categoria)}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="local">Local</label>
            <select
              id="local"
              name="local"
              value={formulario.local}
              onChange={alterarCampo}
            >
              <option value="">Selecione um local</option>
              {locais.map((local, index) => (
                <option key={index} value={valorOpcao(local)}>
                  {textoOpcao(local)}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="data_encontrado">Data em que foi encontrado</label>
            <input
              id="data_encontrado"
              name="data_encontrado"
              type="date"
              value={formulario.data_encontrado}
              onChange={alterarCampo}
            />
          </div>
        </div>

        {erro && <div className="mensagem mensagem-erro">{erro}</div>}
        {sucesso && <div className="mensagem mensagem-sucesso">{sucesso}</div>}

        <div className="form-acoes">
          <Link to={editando ? `/item/${id}` : "/"} className="btn btn-secundario">
            Cancelar
          </Link>
          <button className="btn btn-primario" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </section>
  );
}

function normalizarLista(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.categorias)) return data.categorias;
  if (Array.isArray(data?.locais)) return data.locais;
  return [];
}

function valorOpcao(opcao) {
  if (typeof opcao === "string") return opcao;
  return opcao?.nome || opcao?.valor || opcao?.name || "";
}

function textoOpcao(opcao) {
  if (typeof opcao === "string") return opcao;
  return opcao?.nome || opcao?.valor || opcao?.name || "";
}
