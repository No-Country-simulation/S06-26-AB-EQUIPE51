// src/components/Banner/Banner.jsx
import imagemBanner from "../../assets/imagem-banner.png"
import styles from "../../styles/banner.module.css"

const Banner = () => {
  return (
    <section className={styles.banner}>
      <div className={styles.overlay} />
      <div className={styles.conteudo}>
        <h1 className={styles.titulo}>
          Tecnologia a<br />
          serviço da<br />
          inclusão
        </h1>
      </div>
    </section>
  )
}

export default Banner