import { Injectable } from '@nestjs/common';

@Injectable()
export class DistanciaService {
  calcularDistanciaKm(
    latitudeOrigem?: number | null,
    longitudeOrigem?: number | null,
    latitudeDestino?: number | null,
    longitudeDestino?: number | null,
  ): number | null {
    const coordenadas = [
      latitudeOrigem,
      longitudeOrigem,
      latitudeDestino,
      longitudeDestino,
    ];

    if (
      !coordenadas.every(
        (coordenada) =>
          typeof coordenada === 'number' && Number.isFinite(coordenada),
      )
    ) {
      return null;
    }

    const raioTerraKm = 6371;
    const paraRadianos = (graus: number) => (graus * Math.PI) / 180;
    const diferencaLatitude = paraRadianos(latitudeDestino! - latitudeOrigem!);
    const diferencaLongitude = paraRadianos(
      longitudeDestino! - longitudeOrigem!,
    );
    const latitudeOrigemRad = paraRadianos(latitudeOrigem!);
    const latitudeDestinoRad = paraRadianos(latitudeDestino!);

    const haversine =
      Math.sin(diferencaLatitude / 2) ** 2 +
      Math.cos(latitudeOrigemRad) *
        Math.cos(latitudeDestinoRad) *
        Math.sin(diferencaLongitude / 2) ** 2;
    const arco = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

    return Number((raioTerraKm * arco).toFixed(2));
  }
}
