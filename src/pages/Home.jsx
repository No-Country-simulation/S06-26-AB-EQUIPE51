import { useState } from "react";
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
  const [menuAberto, setMenuAberto] = useState(false);

  const fecharMenu = () => setMenuAberto(false);

  return (
    <>
      <div className={styles.page}>
        <nav className={styles.nav}>
          <img src={logo} alt="logo" className={styles.logo} />

          {/* Links desktop */}
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

          {/* Botão hambúrguer (só aparece no mobile via CSS) */}
          <button
            className={`${styles.btnMenu} ${
              menuAberto ? styles.btnMenuOculto : ""
            }`}
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
          >
            <span className={styles.linhaMenu}></span>
            <span className={styles.linhaMenu}></span>
            <span className={styles.linhaMenu}></span>
          </button>
        </nav>

        {/* Overlay escuro de fundo */}
        <div
          className={`${styles.overlay} ${
            menuAberto ? styles.overlayAberto : ""
          }`}
          onClick={fecharMenu}
        />

        {/* Drawer lateral */}
        <div
          className={`${styles.drawer} ${
            menuAberto ? styles.drawerAberto : ""
          }`}
        >
          <button
            className={styles.btnFechar}
            onClick={fecharMenu}
            aria-label="Fechar menu"
          >
            ×
          </button>

          <a href="#sobre" className={styles.drawerLink} onClick={fecharMenu}>
            Sobre
          </a>
          <a
            href="#servicos"
            className={styles.drawerLink}
            onClick={fecharMenu}
          >
            Serviços
          </a>
          <Link
            to="/empresa/cadastro"
            className={styles.drawerLink}
            onClick={fecharMenu}
          >
            Cadastrar empresa
          </Link>
          <Link
            to="/login"
            className={`${styles.drawerLink} ${styles.drawerLinkDestaque}`}
            onClick={fecharMenu}
          >
            Login empresa
          </Link>
        </div>

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
