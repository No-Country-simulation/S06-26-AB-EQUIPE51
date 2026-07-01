import React from "react";
import styles from "../../styles/sectionMapa.module.css";
import { Link } from "react-router-dom";

const SectionMapa = () => {
  return (
    <section className={styles.hero} id="sectionMapa">
      <div className={styles.overlay} />
      <div className={styles.conteudo}>
        <h1 className={styles.titulo}>
          Encontre profissionais por meio da nossa tecnologia de geolocalização.
        </h1>
        <Link to="/empresa/cadastro" className={styles.botao}>
          Começar agora
        </Link>
      </div>
    </section>
  );
};

export default SectionMapa;
