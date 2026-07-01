// src/utils/tratarErroHttp.js
//
// Função central de tratamento de erros HTTP, seguindo a tabela
// do documento de requisitos V2. Qualquer catch() de chamada de API
// deve passar o erro por aqui antes de mostrar pro usuário.
//
// Uso típico:
//   try {
//     await criarVaga(dados)
//   } catch (error) {
//     toast.error(tratarErroHttp(error))
//   }

export function tratarErroHttp(error) {
  const status = error.response?.status
  const mensagemBackend = error.response?.data?.message

  switch (status) {
    case 400:
      // erro de validação — o backend geralmente já manda uma mensagem
      // específica (ex: "E-mail já cadastrado"), então priorizamos ela
      return mensagemBackend || "Dados inválidos. Verifique os campos e tente novamente."

    case 401:
      // normalmente não chega aqui, porque o interceptor do api.js
      // já tenta o refresh automático antes. Se chegar, é porque
      // o refresh também falhou.
      return "Sua sessão expirou. Faça login novamente."

    case 403:
      return "Você não tem permissão para realizar esta ação."

    case 404:
      return "Recurso não encontrado."

    case 409:
      return mensagemBackend || "Já existe um registro com esses dados."

    case 429:
      return "Muitas tentativas em pouco tempo. Aguarde um momento e tente novamente."

    case 500:
      return "Erro interno do servidor. Tente novamente mais tarde."

    default:
      // erro de rede (sem resposta do servidor) ou status não mapeado
      if (!error.response) {
        return "Não foi possível conectar ao servidor. Verifique sua conexão."
      }
      return mensagemBackend || "Ocorreu um erro inesperado."
  }
}