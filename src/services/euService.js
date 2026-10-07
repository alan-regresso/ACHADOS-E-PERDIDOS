import api from "./api";

export function getEu() {
  return api.get("/eu");
}
