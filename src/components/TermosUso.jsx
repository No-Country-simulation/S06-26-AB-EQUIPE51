import styles from "../styles/termosUso.module.css"

export default function TermosUso({ aberto, onFechar }) {
  if (!aberto) return null

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>

        <div className={styles.header}>
          <h3 className={styles.titulo}>Termos de Uso</h3>
          <button className={styles.fechar} onClick={onFechar}>✕</button>
        </div>

        <div className={styles.corpo}>
          <p className={styles.data}>Última atualização: Junho de 2026</p>
          <p>Ao utilizar a plataforma App BiT, o usuário declara ter lido e concordado com os presentes Termos de Uso.</p>

          <h4>1. Objetivo da Plataforma</h4>
          <p>A App BiT é uma plataforma voltada para apoiar empresas em iniciativas de diversidade, inclusão e recrutamento de talentos de grupos sub-representados por meio de ferramentas de análise, matching e indicadores ESG.</p>

          <h4>2. Cadastro</h4>
          <p>O usuário compromete-se a fornecer informações verdadeiras, completas e atualizadas durante o cadastro e utilização da plataforma.</p>

          <h4>3. Responsabilidades do Usuário</h4>
          <p>O usuário concorda em:</p>
          <ul>
            <li>Utilizar a plataforma de forma ética e legal;</li>
            <li>Não fornecer informações falsas;</li>
            <li>Não tentar acessar áreas restritas sem autorização;</li>
            <li>Não utilizar a plataforma para fins discriminatórios ou ilegais.</li>
          </ul>

          <h4>4. Responsabilidades da Plataforma</h4>
          <p>A plataforma buscará manter seus serviços disponíveis e seguros, porém não garante disponibilidade contínua e ininterrupta.</p>

          <h4>5. Matching e Recomendações</h4>
          <p>Os resultados apresentados pelo sistema possuem caráter informativo e de apoio à tomada de decisão. A decisão final de contratação é de responsabilidade exclusiva da empresa usuária.</p>

          <h4>6. Propriedade Intelectual</h4>
          <p>Todos os elementos da plataforma, incluindo marca, interface, funcionalidades e conteúdos produzidos pela equipe, permanecem protegidos pelas legislações aplicáveis.</p>

          <h4>7. Suspensão de Acesso</h4>
          <p>A App BiT poderá suspender ou encerrar contas que violem estes Termos de Uso ou utilizem a plataforma de maneira inadequada.</p>

          <h4>8. Alterações</h4>
          <p>Os Termos de Uso poderão ser modificados a qualquer momento para refletir melhorias, adequações legais ou novas funcionalidades.</p>
        </div>

      </div>
    </div>
  )
}