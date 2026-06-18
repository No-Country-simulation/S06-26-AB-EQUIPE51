import React from 'react'
import imagemBanner from "../../assets/imagem-banner.png"
import styles from "../../styles/banner.module.css"
import logo from "../../assets/logo-inclusive-tech.png"

const Banner = () => {
  return <>
  <div className={styles.banner}>
    <img src={logo} alt="" className={styles.logo}/>
    <p>Tecnologia a serviço da inclusão.</p>
  </div>
  
  </>
}

export default Banner
