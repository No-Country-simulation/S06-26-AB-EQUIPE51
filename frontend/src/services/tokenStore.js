let accessTokenEmMemoria = null

export function getAccessToken() {
  return accessTokenEmMemoria
}

export function setAccessToken(token) {
  accessTokenEmMemoria = token
}

export function limparAccessToken() {
  accessTokenEmMemoria = null
}
