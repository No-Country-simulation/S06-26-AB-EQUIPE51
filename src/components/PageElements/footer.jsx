import React from 'react'
import styles from "../../styles/footer.module.css"

const NAV_LINKS = [
  { label: "Mapa de Talentos" },
  { label: "Vagas" },
  { label: "Cadastrar Vaga" },
  { label: "Candidatos" },
]



const footer = () => {
  return<>
    <footer className={styles.footer}>
      <div className={styles.topo}>
        <div className={styles.logoWrap}>
          <strong className={styles.logo}>InclusiveTech</strong>
        </div>
        <nav className={styles.nav}>
          {NAV_LINKS.map(link => (
            <a key={link.label} href="#" className={styles.link}>
              {link.label}
            </a>
          ))}
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
