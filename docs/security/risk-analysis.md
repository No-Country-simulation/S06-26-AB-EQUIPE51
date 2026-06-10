# Análise de Riscos

| Risco                            | Impacto | Mitigação                  |
| -------------------------------- | ------- | -------------------------- |
| Vazamento de dados de candidatos | Alto    | Controle de acesso         |
| Roubo de credenciais             | Alto    | bcrypt + JWT               |
| Exposição de dados sensíveis     | Alto    | Autorização adequada       |
| Dados inválidos na plataforma    | Médio   | Validação de entrada       |
| Viés na recomendação da IA       | Alto    | Revisão humana obrigatória |
| Exposição de credenciais no GitHub | Alto    | Variáveis de ambiente    |
| Banco exposto à internet           | Alto    | Restrição de acesso      |
| Falta de HTTPS                     | Alto    | TLS obrigatório          |
| Uso indevido da API                | Médio   | Rate Limiting            |
| Vazamento de token JWT             | Alto    | Expiração e renovação    |


## Considerações

A plataforma deve atuar como sistema de recomendação e não como mecanismo automático de contratação.
