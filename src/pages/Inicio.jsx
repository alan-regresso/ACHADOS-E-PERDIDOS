import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { listarItens } from "../services/itemService";
import { listarCategorias, listarLocais } from "../services/opcoesService";

export default function Inicio() {
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);
  const [filtros, setFiltros] = useState({
    busca: "",
    status: "",
    categoria: "",
    local: ""
  });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [categoriasResposta, locaisResposta] = await Promise.all([
          listarCategorias(),
          listarLocais()
        ]);

        setCategorias(normalizarLista(categoriasResposta.data));
        setLocais(normalizarLista(locaisResposta.data));
      } catch {
        setCategorias([]);
        setLocais([]);
      }
    }

    carregarOpcoes();
  }, []);

  useEffect(() => {
    carregarItens();
  }, [filtros]);

  async function carregarItens() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await listarItens(filtros);
      setItens(normalizarLista(resposta.data));
    } catch (error) {
      setErro(
        error.response?.data?.detail ||
          "Não foi possível carregar os itens. Verifique sua chave da API."
      );
    } finally {
      setCarregando(false);
    }
  }

  function alterarFiltro(event) {
    const { name, value } = event.target;
    setFiltros((atual) => ({
      ...atual,
      [name]: value
    }));
  }

  function limparFiltros() {
    setFiltros({
      busca: "",
      status: "",
      categoria: "",
      local: ""
    });
  }

  return (
    <section>
      <div className="pagina-titulo">
        <div>
          <span className="eyebrow">PAINEL</span>
          <h1>Itens encontrados</h1>
          <p>Consulte, filtre e gerencie os objetos encontrados.</p>
        </div>
        <Link to="/novo" className="btn btn-primario">
          + Novo item
        </Link>
      </div>

      <div className="filtros">
        <div className="campo busca">
          <label htmlFor="busca">Buscar</label>
          <input
            id="busca"
            name="busca"
            value={filtros.busca}
            onChange={alterarFiltro}
            placeholder="Nome ou descrição..."
          />
        </div>

        <div className="campo">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={filtros.status} onChange={alterarFiltro}>
            <option value="">Todos</option>
            <option value="aguardando">Aguardando</option>
            <option value="devolvido">Devolvido</option>
          </select>
        </div>

        <div className="campo">
          <label htmlFor="categoria">Categoria</label>
          <select
            id="categoria"
            name="categoria"
            value={filtros.categoria}
            onChange={alterarFiltro}
          >
            <option value="">Todas</option>
            {categorias.map((categoria, index) => (
              <option key={index} value={valorOpcao(categoria)}>
                {textoOpcao(categoria)}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="local">Local</label>
          <select id="local" name="local" value={filtros.local} onChange={alterarFiltro}>
            <option value="">Todos</option>
            {locais.map((local, index) => (
              <option key={index} value={valorOpcao(local)}>
                {textoOpcao(local)}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-limpar" onClick={limparFiltros}>
          Limpar
        </button>
      </div>

      <div className="lista-topo">
        <strong>{itens.length} item(ns)</strong>
        <span>Resultados da sua chave</span>
      </div>

      {carregando && <Loading texto="Carregando itens..." />}

      {!carregando && erro && (
        <ErrorMessage mensagem={erro} tentarNovamente={carregarItens} />
      )}

      {!carregando && !erro && itens.length === 0 && (
        <div className="estado">
          <div className="estado-icone">📦</div>
          <h3>Nenhum item encontrado</h3>
          <p>Não há itens para os filtros selecionados.</p>
        </div>
      )}

      {!carregando && !erro && itens.length > 0 && (
        <div className="lista-itens">
          {itens.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function normalizarLista(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.itens)) return data.itens;
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
