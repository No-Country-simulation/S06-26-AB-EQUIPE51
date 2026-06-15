import { Link } from 'react-router-dom'
import styles from '../styles/home.module.css'

const Home = () => {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <span className={styles.navLogo}>Inclusive Tech</span>
        <div className={styles.navLinks}>
          <Link to="" className={styles.navLink}>Sobre</Link>
          <Link to="" className={styles.navLink}>Missão</Link>
          <Link to="/empresa/cadastro" className={styles.navLink}>Cadastrar empresa</Link>
          <Link to="/login" className={`${styles.navLink} ${styles.navLinkDestaque}`}>Login empresa</Link>
          {/* <Link to="/vagas/cadastro" className={`${styles.navLink} ${styles.navLinkDestaque}`}>Cadastrar Vaga</Link> */}
        </div>
      </nav>

      <main className={styles.main}>
        {/* conteúdo da home vai aqui */}
      </main>
    </div>
  )
}

export default Home