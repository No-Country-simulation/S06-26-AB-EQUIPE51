// src/components/MapaCalor/MapaCalor.jsx
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'

// AJUSTAR: coordenada central do mapa — hoje fixo em Florianópolis
const CENTRO_PADRAO = [-27.5954, -48.5480]
const ZOOM_PADRAO = 12

export default function MapaCalor({ pontos }) {
  const containerRef = useRef(null)
  const mapaRef = useRef(null)
  const heatLayerRef = useRef(null)
  const marcadoresRef = useRef([])

  // cria o mapa uma única vez, quando o componente monta
  useEffect(() => {
    if (mapaRef.current) return // já existe, não recria

    mapaRef.current = L.map(containerRef.current).setView(CENTRO_PADRAO, ZOOM_PADRAO)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapaRef.current)

    return () => {
      mapaRef.current?.remove()
      mapaRef.current = null
    }
  }, [])

  // atualiza os pontos (heatmap + marcadores) sempre que "pontos" mudar
  useEffect(() => {
    if (!mapaRef.current) return

    // remove a camada de calor anterior, se existir
    if (heatLayerRef.current) {
      mapaRef.current.removeLayer(heatLayerRef.current)
    }
    // remove marcadores antigos
    marcadoresRef.current.forEach(m => mapaRef.current.removeLayer(m))
    marcadoresRef.current = []

    if (!pontos || pontos.length === 0) return

    // AJUSTAR: aqui assumo que cada ponto tem .latitude e .longitude
    const dadosCalor = pontos
      .filter(p => p.latitude && p.longitude)
      .map(p => [p.latitude, p.longitude, 1]) // o "1" é a intensidade de cada ponto

    heatLayerRef.current = L.heatLayer(dadosCalor, {
      radius: 30,
      blur: 25,
      maxZoom: 14,
    }).addTo(mapaRef.current)

    // adiciona um marcador (pino) por talento, igual ao print de referência
    pontos.forEach(p => {
      if (!p.latitude || !p.longitude) return
      const marcador = L.circleMarker([p.latitude, p.longitude], {
        radius: 6,
        fillColor: '#000',
        fillOpacity: 0.7,
        color: '#fff',
        weight: 1,
      })
        .bindPopup(p.nome ?? 'Talento') // AJUSTAR: campo de nome
        .addTo(mapaRef.current)

      marcadoresRef.current.push(marcador)
    })
  }, [pontos])

  return <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: 320 }} />
}