// src/components/SectionSobre/SectionSobre.jsx
import styles from "../../styles/sectionSobre.module.css";
import { Link } from "react-router-dom";

export default function SectionSobre() {
  return (
    <section className={styles.main} id="sobre">
      <div className={styles.fotosWrap}>
        <div className={styles.fotoGrande}></div>
        <div className={styles.fotoPequena}></div>
      </div>

      <div className={styles.sobre}>
        <span className={styles.tag}>INCLUSIVE TECH</span>
        <h2 className={styles.titulo}>SOBRE</h2>
        <p className={styles.texto}>
          Conectamos empresas e talentos através da tecnologia, promovendo
          inclusão e ampliando oportunidades para grupos sub-representados.
        </p>
        <Link to="/empresa/cadastro" className={styles.botaoHome}>
          Comece já!
        </Link>
      </div>
    </section>
  );
}
