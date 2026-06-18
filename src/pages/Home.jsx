import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";
import Banner from "../components/PageElements/Banner";
import Footer from "../components/PageElements/footer";
import logo from "../assets/logo-inclusive-tech.png"

const Home = () => {
  return (
    <>
      <div className={styles.page}>
        <nav className={styles.nav}>
          <img src={logo} alt=""  className={styles.logo}/>
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
          <div className={styles.sobre}>
            <p className={styles.texto}>
              <span>Conectamos empresas e talentos através da tecnologia</span>,
              promovendo inclusão e ampliando oportunidades.
            </p>
            <button>
              <p>Comece já!</p>
            </button>
          </div>
          <div className={styles.divFoto}>
            <div className={styles.foto}></div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default Home;
