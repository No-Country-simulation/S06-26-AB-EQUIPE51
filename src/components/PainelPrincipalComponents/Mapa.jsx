import styles from "../../styles/mapa.module.css"


export default function Mapa() {
  return (
    <div className={styles.mapaWrap}>
      {/* SVG do mapa aqui — quando vier o dataset substituímos os dados */}
      {/* <MapaSVG regioes={REGIOES} /> */}
      {/* <Legenda regioes={REGIOES} /> */}
    </div>
  )
}