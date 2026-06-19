// src/components/Depoimentos/Depoimentos.jsx
import styles from '../../styles/depoimentos.module.css'

const DEPOIMENTOS = [
  {
    nome: "Mariana Souza",
    cargo: "RH na TechBras",
    foto: "/avatars/mariana.jpg",
    texto: "Encontramos talentos diversos em semanas, não meses. O match por IA realmente entende o que buscamos.",
  },
  {
    nome: "Carlos Lima",
    cargo: "Fundador da Vortex",
    foto: "/avatars/carlos.jpg",
    texto: "O mapa de geolocalização mudou como planejamos nossas contratações regionais. Muito intuitivo.",
  },
  {
    nome: "Aline Ferreira",
    cargo: "Gestora ESG",
    foto: "/avatars/aline.jpg",
    texto: "Conseguimos acompanhar nossas metas de diversidade com transparência total. Recomendo demais.",
  },
]

export default function Depoimentos() {
  return (
    <section className={styles.section}>
      <span className={styles.tag}>DEPOIMENTOS</span>
      <h2 className={styles.titulo}>O que dizem sobre a InclusiveTech</h2>

      <div className={styles.grid}>
        {DEPOIMENTOS.map(dep => (
          <div key={dep.nome} className={styles.card}>
            <p className={styles.texto}>"{dep.texto}"</p>
            <div className={styles.autor}>
              <img src={dep.foto} alt={dep.nome} className={styles.avatar} />
              <div>
                <strong className={styles.nome}>{dep.nome}</strong>
                <span className={styles.cargo}>{dep.cargo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}