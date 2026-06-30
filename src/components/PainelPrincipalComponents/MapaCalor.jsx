import { useEffect, useMemo, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.heat"

const CENTRO_PADRAO = [-27.5954, -48.5480]
const ZOOM_PADRAO = 12

export default function MapaCalor({ pontos }) {
  const containerRef = useRef(null)
  const mapaRef = useRef(null)
  const heatLayerRef = useRef(null)
  const marcadoresRef = useRef([])

  const pontosValidos = useMemo(() => {
    if (!Array.isArray(pontos)) return []

    return pontos.filter((ponto) => {
      const latitude = Number(ponto?.latitude)
      const longitude = Number(ponto?.longitude)
      return Number.isFinite(latitude) && Number.isFinite(longitude)
    })
  }, [pontos])

  useEffect(() => {
    if (mapaRef.current || !containerRef.current) return

    mapaRef.current = L.map(containerRef.current).setView(
      CENTRO_PADRAO,
      ZOOM_PADRAO
    )

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "OpenStreetMap contributors",
    }).addTo(mapaRef.current)

    return () => {
      mapaRef.current?.remove()
      mapaRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapaRef.current) return

    if (heatLayerRef.current) {
      mapaRef.current.removeLayer(heatLayerRef.current)
      heatLayerRef.current = null
    }

    marcadoresRef.current.forEach((marcador) => {
      mapaRef.current?.removeLayer(marcador)
    })
    marcadoresRef.current = []

    if (pontosValidos.length === 0) return

    const dadosCalor = pontosValidos.map((ponto) => [
      Number(ponto.latitude),
      Number(ponto.longitude),
      1,
    ])

    heatLayerRef.current = L.heatLayer(dadosCalor, {
      radius: 30,
      blur: 25,
      maxZoom: 14,
    }).addTo(mapaRef.current)

    pontosValidos.forEach((ponto) => {
      const marcador = L.circleMarker(
        [Number(ponto.latitude), Number(ponto.longitude)],
        {
          radius: 6,
          fillColor: "#000",
          fillOpacity: 0.7,
          color: "#fff",
          weight: 1,
        }
      )
        .bindPopup(ponto.nome ?? "Talento")
        .addTo(mapaRef.current)

      marcadoresRef.current.push(marcador)
    })
  }, [pontosValidos])

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", minHeight: 320 }}
    />
  )
}
