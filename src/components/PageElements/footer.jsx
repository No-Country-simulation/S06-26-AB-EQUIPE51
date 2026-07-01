import React from 'react'
import styles from "../../styles/footer.module.css"
import logo from "../../assets/logo-inclusive-tech.png"
import { Link }from "react-router-dom";

const footer = () => {
  return<>
    <footer className={styles.footer}>
      <div className={styles.topo}>
      <img src={logo} alt="" className={styles.logo} />
        <nav className={styles.nav}>
          <div className={styles.nav}>
            <a href="#sobre" className={styles.link}>
              Sobre
            </a>
            <a href="#servicos" className={styles.link}>
              Serviços
            </a>
            <Link to="/empresa/cadastro" className={styles.link}>
              Cadastrar empresa
            </Link>
            <Link
              to="/login"
              className={styles.link}
            >
              Login empresa
            </Link>
          </div>
        </nav>
      </div>
       
  
      <div className={styles.divisor} />
      <p className={styles.copy}>
        © {new Date().getFullYear()} InclusiveTech. Todos os direitos reservados.
      </p>
    </footer>
  </>
    
  
}

export default footer
