import styles from "../../styles/CTA.module.css";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className={styles.cta}>
      <h2 className={styles.titulo}>
        Pronto para encontrar os talentos certos?
      </h2>
      <p className={styles.subtitulo}>
        Cadastre sua empresa e comece a conectar-se com profissionais diversos
        hoje mesmo.
      </p>
      <Link to="/empresa/cadastro" className={styles.botao}>
        Cadastrar minha empresa!
      </Link>
    </section>
  );
}
