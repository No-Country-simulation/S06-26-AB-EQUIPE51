# Requisitos de Segurança

## REQ-001 - Senhas

* Senhas não devem ser armazenadas em texto puro.
* Utilizar bcrypt para hash de senhas.

## REQ-002 - Autenticação

* Usuários devem realizar login para acessar áreas protegidas.
* Utilizar JWT para autenticação.

## REQ-003 - Controle de Acesso

* Empresas não devem acessar informações de outras empresas.
* Candidatos devem visualizar apenas seus próprios dados.

## REQ-004 - Validação de Entrada

* Todos os campos enviados para a API devem ser validados.
* Emails devem possuir formato válido.
* Campos obrigatórios não podem ser nulos.

## REQ-005 - Logs

* Registrar criação de vagas.
* Registrar criação de empresas.
* Registrar alterações relevantes.
