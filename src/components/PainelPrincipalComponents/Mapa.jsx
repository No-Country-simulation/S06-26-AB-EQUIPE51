// Mapa.jsx
import styles from '../../styles/mapa.module.css'

// dados mock — troque pela API real quando o mapa de calor for implementado
const TOTAL_TALENTOS = 94

const USUARIOS = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  nome: `Usuário ${i + 1}`,
  qtd: 1,
}))

export default function Mapa() {
  return (
    <div className={styles.pagina}>

      {/* Cabeçalho */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.titulo}>Mapa de Talentos</h1>
          <p className={styles.subtitulo}>Veja o mapa de calor somente da cidade de Florianópolis.</p>
        </div>
        <button className={styles.btnOpcoes}>Opções ▾</button>
      </header>

      <div className={styles.conteudo}>

        <div className={styles.colunaPrincipal}>

          {/* Bloco do mapa */}
          <section className={styles.bloco}>
            <div className={styles.blocoHeader}>
              <div>
                <h3 className={styles.blocoTitulo}>Mapa de Talentos</h3>
                <p className={styles.blocoSubtitulo}>Mapa de calor somente da cidade de Florianópolis.</p>
              </div>
              <div className={styles.acoes}>
                <select className={styles.selectCidade}>
                  <option>Cidade de Florianópolis</option>
                </select>
                <button className={styles.btnFiltros}>⚙ Filtros</button>
              </div>
            </div>

            {/* Placeholder do mapa — entra o Leaflet aqui depois */}
            <div className={styles.mapaPlaceholder}>
              <span>🗺️ Mapa de calor (Leaflet) será integrado aqui</span>
            </div>
          </section>

        </div>

        {/* Coluna direita */}
        <aside className={styles.colunaDireita}>

          <section className={styles.bloco}>
            <h3 className={styles.visaoLabel}>Visão Geral</h3>
            <strong className={styles.visaoNumero}>{TOTAL_TALENTOS}</strong>
            <p className={styles.visaoDesc}>Talentos ativos</p>
            <div className={styles.backendBadge}>
              <strong>Backend</strong>
              <span>fonte autorizada</span>
            </div>
          </section>

          <section className={styles.bloco}>
            <h3 className={styles.usuariosTitulo}>Usuários no mapa</h3>
            <div className={styles.listaUsuarios}>
              {USUARIOS.map(u => (
                <div key={u.id} className={styles.usuarioLinha}>
                  <span className={styles.usuarioNum}>{u.id}</span>
                  <span className={styles.usuarioDot} />
                  <span className={styles.usuarioNome}>{u.nome}</span>
                  <span className={styles.usuarioQtd}>{u.qtd}</span>
                </div>
              ))}
            </div>
          </section>

        </aside>
      </div>
    </div>
  )
}