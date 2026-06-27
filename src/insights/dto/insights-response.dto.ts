export class MapaTalentosDto {
  regiao!: string;

  concentracao!: number;

  cobertura_rede!: string;

  perfis_disponiveis!: number;

  lat?: number;

  lon?: number;
}

export class InsightsResponseDto {
  mapa_talentos!: MapaTalentosDto[];

  total_regioes!: number;

  total_candidatos!: number;
}
