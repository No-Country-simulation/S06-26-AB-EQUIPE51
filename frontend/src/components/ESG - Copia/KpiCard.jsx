import styles from "./KpiCard.module.css";

export default function KpiCard({
  titulo,
  valor,
  descricao,
  cor = "#4F46E5",
  progresso = null,
  sufixo = "",
}) {
  return (
    <div className={styles.card}>

      <span className={styles.titulo}>{titulo}</span>

      <h2 className={styles.valor} style={{ color: cor }}>
        {valor}{sufixo}
      </h2>

      {/* Barra de progresso (ESG style) */}
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