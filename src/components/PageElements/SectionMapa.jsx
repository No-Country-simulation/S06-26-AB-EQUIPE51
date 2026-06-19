import React from 'react'
import styles from "../../styles/sectionMapa.module.css"

const SectionMapa = () => {
  return (
    <section className={styles.hero}>
    <div className={styles.overlay} />
    <div className={styles.conteudo}>
      <h1 className={styles.titulo}>
        Encontre profissionais por meio da nossa tecnologia de geolocalização.
      </h1>
      <button className={styles.botao}>Começar agora</button>
    </div>
  </section>
  )
}

export default SectionMapa
