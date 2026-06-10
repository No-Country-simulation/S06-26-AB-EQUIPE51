# Cloud Security

## Objetivo

Garantir que a infraestrutura do App BiT seja implantada de forma segura, protegendo os dados de empresas e candidatos.

---

## Gestão de Segredos

As credenciais da aplicação não devem ser armazenadas no código-fonte nem em repositórios Git.

Exemplos:

- DATABASE_URL
- JWT_SECRET
- OPENAI_API_KEY

Todas as credenciais devem ser armazenadas em variáveis de ambiente e acessadas apenas pelos serviços autorizados.

---

## Segurança do Deploy

### Frontend

- Hospedagem em Vercel
- HTTPS obrigatório

### Backend

- Hospedagem em AWS EC2, Railway ou Render
- HTTPS obrigatório
- Controle de acesso restrito

### Banco de Dados

- PostgreSQL gerenciado
- Acesso restrito à aplicação
- Backups periódicos quando suportados pela plataforma de hospedagem

---

## Segurança da API

- Autenticação via JWT
- Validação de entrada dos dados
- Tratamento seguro de erros
- Rate Limiting para prevenção de abuso

---

## Segurança da IA

O sistema de matching deve atuar como ferramenta de recomendação e apoio à decisão.

Boas práticas:

- Explicabilidade dos resultados
- Registro dos critérios utilizados no score
- Revisão humana das recomendações
- Mitigação de vieses indevidos

---

## Monitoramento

Registrar eventos relevantes para auditoria e investigação de incidentes:

- Criação de empresas
- Publicação de vagas
- Execução de matching
- Tentativas de autenticação inválidas
- Erros críticos da aplicação