import styles from "./MatchCard.module.css";

export default function MatchCard({
    candidato,
    index,
    vagaSelecionada,
    extrairSkillsIA,
    formatarCargo,
    gerarResumoIA,
    onAbrirAnalise
}) {

    const skills = extrairSkillsIA(candidato);

    return (

        <article className={styles.card}>

            <div className={styles.rank}>
                {index + 1}
            </div>

            <div className={styles.esquerda}>

                <div className={styles.avatar}>

                    {candidato.nome
                        .split(" ")
                        .map(n => n[0])
                        .slice(0,2)
                        .join("")}

                </div>

                <div className={styles.info}>

                    <h3>{candidato.nome}</h3>

                    <span>

                        {formatarCargo(vagaSelecionada?.cargo)}

                    </span>

                    <div className={styles.skills}>

                        {skills.map((skill,i)=>(

                            <span key={i}>

                                {skill}

                            </span>

                        ))}

                    </div>

                    <p className={styles.resumo}>
                        {gerarResumoIA(candidato)}
                    </p>

                </div>

            </div>

            <div className={styles.direita}>

                <div className={styles.score}>

                    <strong>

                        {Math.round(candidato.score_final)}%

                    </strong>

                    <small>

                        SCORE FINAL

                    </small>

                </div>

                <button onClick={onAbrirAnalise}>

                    Ver análise IA ↗

                </button>

            </div>

        </article>

    );

}