// src/store/matchStore.js

let ultimoMatch = null;

/**
 * Salva o último resultado de match gerado
 * (usado no Dashboard e no Relatório ESG)
 */
export function setUltimoMatch(match) {
  ultimoMatch = match;
}

/**
 * Retorna o último match salvo
 */
export function getUltimoMatch() {
  return ultimoMatch;
}

/**
 * Limpa o match (logout ou reset)
 */
export function limparUltimoMatch() {
  ultimoMatch = null;
}

