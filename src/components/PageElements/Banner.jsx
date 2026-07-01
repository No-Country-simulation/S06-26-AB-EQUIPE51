// src/components/Banner/Banner.jsx
import styles from "../../styles/banner.module.css"
import logo from "../../assets/logoInclusiveTechBranco.svg"

const Banner = () => {
  return (
    <section className={styles.banner}>
      <div className={styles.overlay} />
      <div className={styles.conteudo}>
     <img src={logo} alt="" className={styles.logo}/>
      </div>
    </section>
  )
}

export default Banner