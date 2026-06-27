# Matching por cargo e modalidade

O matching aceita somente candidatos cujo `cargoDesejado` seja igual ao `cargo` da vaga. Essa filtragem ocorre antes do cálculo e candidatos de outras trilhas profissionais não entram no ranking nem em `total_analisados`.

## Pesos

| Modalidade   | Cargo | Skills | Nível | Diversidade | Mobilidade |
| ------------ | ----: | -----: | ----: | ----------: | ---------: |
| `REMOTO`     |   35% |    40% |   15% |         10% |         0% |
| `HIBRIDO`    |   30% |    35% |   15% |         10% |        10% |
| `PRESENCIAL` |   25% |    30% |   15% |         10% |        20% |

Em vagas remotas, região, coordenadas e `scoreMobilidade` não afetam o resultado. Vagas híbridas e presenciais utilizam mobilidade com os pesos da tabela.

## Explicabilidade

Cada item da shortlist retorna `motivos`, com cargo, skills, nível, modalidade, mobilidade e alinhamento ESG. O campo legado `explicacao` permanece disponível com o mesmo conteúdo.

## Distância geográfica

Candidato e vaga mantêm `latitude` e `longitude`. O `DistanciaService.calcularDistanciaKm` implementa Haversine e retorna a distância em quilômetros ou `null` quando faltam coordenadas. Ele está preparado para substituir gradualmente o score isolado de mobilidade; ainda não altera o ranking atual.
