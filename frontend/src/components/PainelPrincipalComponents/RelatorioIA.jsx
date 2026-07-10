import styles from "./RelatorioIA.module.css";
import { X, Brain, TrendingUp, TriangleAlert } from "lucide-react";

export default function RelatorioIA({ aberto, onClose, dados }) {

    if (!aberto) return null;

    const vaga = dados?.vaga;
    const empresa = dados?.empresa;
    const resposta = dados?.resposta;

    const candidatos = resposta?.candidatos ?? [];

    const topCandidato = candidatos[0];

    const scoreMedio =
        candidatos.length > 0
            ? Math.round(
                candidatos.reduce(
                    (acc, c) => acc + (c.score_match ?? 0),
                    0
                ) / candidatos.length
            )
            : 0;

    if (!aberto) return null;
    


    return (

        <div className={styles.overlay}>

            <div className={styles.modal}>

                <button
                    className={styles.fechar}
                    onClick={onClose}
                >
                    <X size={22}/>
                </button>

                <h2>
                    🧠 Relatório Inteligente ESG
                </h2>

                <p className={styles.subtitulo}>
                    Recomendações geradas pelo Motor IA
                </p>

                <div className={styles.bloco}>

                    <h3>
                        <Brain size={18}/>
                        Resumo Executivo
                    </h3>

                    <div>

                        <p><strong>Empresa: </strong> {empresa?.nomeEmpresa}</p>

                        <p><strong>Vaga: </strong> {vaga?.titulo}</p>

                        <p><strong>Candidatos: </strong> {candidatos.length}</p>

                        <p><strong>Compatibilidade média: </strong> {scoreMedio}%</p>

                    </div>

                </div>

                <div className={styles.bloco}>

                    <h3>
                        Melhor candidato
                    </h3>

                    {topCandidato ? (

                        <>

                            <p>

                                <strong>{topCandidato.nome}</strong>

                            </p>

                            <p>

                                Score: {topCandidato.score_match}%

                            </p>

                            <p>

                                Cargo: {topCandidato.cargoDesejado}

                            </p>

                        </>

                    ) : (

                        <p>Nenhum candidato encontrado.</p>

                    )}

                </div>

                <div className={styles.bloco}>

                    <h3>

                        <TrendingUp size={18}/>

                        Recomendações

                    </h3>

                    <ul>

                        {topCandidato?.motivos?.map((motivo, index) => (

                            <li key={index}>

                                {motivo}

                            </li>

                        ))}

                    </ul>

                </div>

                <div className={styles.bloco}>

                    <h3>

                        <TriangleAlert size={18}/>

                        Impacto esperado

                    </h3>

                    <p>

                        A IA encontrou

                        <strong> {candidatos.length} candidatos </strong>

                         para a vaga

                        <strong> {vaga?.titulo} </strong>

                         com média de

                        <strong> {scoreMedio}% </strong>

                         de compatibilidade.

                    </p>

                </div>

            </div>

        </div>

    );

}