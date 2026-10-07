import api from "./api";

export function listarCategorias() {
  return api.get("/categorias");
}

export function listarLocais() {
  return api.get("/locais");
}
