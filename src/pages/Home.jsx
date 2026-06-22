import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";
import Banner from "../components/PageElements/Banner";
import Footer from "../components/PageElements/footer";
import logo from "../assets/logo-inclusive-tech.png";
import SectionMapa from "../components/PageElements/SectionMapa";
import Servicos from "../components/PageElements/Servicos";
import CTA from "../components/PageElements/CTA";
import Depoimentos from "../components/PageElements/Depoimentos";
import SectionSobre from "../components/PageElements/SectionSobre";

const Home = () => {
  return (
    <>
      <div className={styles.page}>
        <nav className={styles.nav}>
          <img src={logo} alt="logo" className={styles.logo} />
          <div className={styles.navLinks}>
            <a href="#sobre" className={styles.navLink}>
              Sobre
            </a>
            <a href="#servicos" className={styles.navLink}>
              Serviços
            </a>
            <Link to="/empresa/cadastro" className={styles.navLink}>
              Cadastrar empresa
            </Link>
            <Link
              to="/login"
              className={`${styles.navLink} ${styles.navLinkDestaque}`}
            >
              Login empresa
            </Link>
          </div>
        </nav>
        <Banner />
       
      </div>
      <SectionSobre />
      <Servicos />
      <SectionMapa />
      <Depoimentos />
      <CTA />
      <Footer />
    </>
  );
};

export default Home;
