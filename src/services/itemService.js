import api from "./api";

export function listarItens(filtros = {}) {
  const params = {};

  if (filtros.status) params.status = filtros.status;
  if (filtros.categoria) params.categoria = filtros.categoria;
  if (filtros.local) params.local = filtros.local;
  if (filtros.busca) params.busca = filtros.busca;

  return api.get("/itens", { params });
}

export function buscarItem(id) {
  return api.get(`/itens/${id}`);
}

export function criarItem(dados) {
  return api.post("/itens", dados);
}

export function atualizarItem(id, dados) {
  return api.put(`/itens/${id}`, dados);
}

export function devolverItem(id, devolvidoPara) {
  return api.patch(`/itens/${id}/devolver`, {
    devolvido_para: devolvidoPara
  });
}

export function excluirItem(id) {
  return api.delete(`/itens/${id}`);
}
