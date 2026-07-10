import axios from "axios";

const iaApi = axios.create({
  baseURL: import.meta.env.VITE_IA_URL,
  timeout: 180000,
});

export async function gerarRecomendacoesESG(payload) {
  const { data } = await iaApi.post("/match", payload);

  return data;
}