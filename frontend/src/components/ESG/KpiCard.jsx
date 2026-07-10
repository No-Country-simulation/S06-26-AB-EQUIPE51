import styles from "./KpiCard.module.css";

export default function KpiCard({
  titulo,
  valor,
  descricao,
  cor = "#4F46E5",
  progresso = null,
  sufixo = "",
  icon = null,
  iconBackground = "#EEF2FF",
}) {

  return (
    <div className={styles.card}>

      <div className={styles.header}>

        {icon && (
          <div
            className={styles.iconBox}
            style={{ background: iconBackground }}
          >
            {icon}
          </div>
        )}

        <span className={styles.titulo}>
          {titulo}
        </span>

      </div>

      <h2
        className={styles.valor}
        style={{ color: cor }}
      >
        {valor}{sufixo}
      </h2>

      {progresso !== null && (
        <div className={styles.barraFundo}>
          <div
            className={styles.barraProgresso}
            style={{
              width: `${progresso}%`,
              backgroundColor: cor,
            }}
          />
        </div>
      )}

      <span className={styles.descricao}>
        {descricao}
      </span>

    </div>
  );
}