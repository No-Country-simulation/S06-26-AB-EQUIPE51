# Análise de Riscos

| Risco                            | Impacto | Mitigação                  |
| -------------------------------- | ------- | -------------------------- |
| Vazamento de dados de candidatos | Alto    | Controle de acesso         |
| Roubo de credenciais             | Alto    | bcrypt + JWT               |
| Exposição de dados sensíveis     | Alto    | Autorização adequada       |
| Dados inválidos na plataforma    | Médio   | Validação de entrada       |
| Viés na recomendação da IA       | Alto    | Revisão humana obrigatória |

## Considerações

A plataforma deve atuar como sistema de recomendação e não como mecanismo automático de contratação.
