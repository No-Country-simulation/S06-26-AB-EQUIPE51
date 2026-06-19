import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";
import Banner from "../components/PageElements/Banner";
import Footer from "../components/PageElements/footer";
import logo from "../assets/logo-inclusive-tech.png";
import SectionMapa from "../components/PageElements/SectionMapa";
import Servicos from "../components/PageElements/Servicos";
import CTA from "../components/PageElements/CTA";
import Depoimentos from "../components/PageElements/Depoimentos";

const Home = () => {
  return (
    <>
      <div className={styles.page}>
        <nav className={styles.nav}>
          <img src={logo} alt="" className={styles.logo} />
          <div className={styles.navLinks}>
            <Link to="" className={styles.navLink}>
              Sobre
            </Link>
            <Link to="" className={styles.navLink}>
              Missão
            </Link>
            <Link to="/empresa/cadastro" className={styles.navLink}>
              Cadastrar empresa
            </Link>
            <Link
              to="/login"
              className={`${styles.navLink} ${styles.navLinkDestaque}`}
            >
              Login empresa
            </Link>
            {/* <Link to="/vagas/cadastro" className={`${styles.navLink} ${styles.navLinkDestaque}`}>Cadastrar Vaga</Link> */}
          </div>
        </nav>
        <Banner />
        <main className={styles.main}>
          <div className={styles.fotosWrap}>
            <div className={styles.fotoGrande}></div>
            <div className={styles.fotoPequena}></div>
          </div>

          <div className={styles.sobre}>
            <span className={styles.tag}>QUEM SOMOS</span>
            <p className={styles.texto}>
              <span>Conectamos empresas e talentos através da tecnologia</span>
              promovendo inclusão e ampliando oportunidades.
            </p>
            <button className={styles.botaoHome}>Comece já!</button>
          </div>
        </main>
      </div>
      <Servicos />
      <SectionMapa />
      <Depoimentos />
      <CTA />
      <Footer />
    </>
  );
};

export default Home;
