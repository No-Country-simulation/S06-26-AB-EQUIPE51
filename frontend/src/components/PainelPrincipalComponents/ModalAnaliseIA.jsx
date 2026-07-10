import styles from "./ModalAnaliseIA.module.css";

import {

    X,
    Brain,
    Code2,
    BriefcaseBusiness,
    BarChart3,
    Users,
    MapPin,
    ChevronDown

} from "lucide-react";

function iconeCriterio(nome){

    const criterio = nome.toLowerCase();

    if(criterio.includes("skill")){

        return <Code2 size={22}/>;

    }

    if(criterio.includes("cargo")){

        return <BriefcaseBusiness size={22}/>;

    }

    if(criterio.includes("nível") || criterio.includes("nivel")){

        return <BarChart3 size={22}/>;

    }

    if(criterio.includes("divers")){

        return <Users size={22}/>;

    }

    if(criterio.includes("mobil")){

        return <MapPin size={22}/>;

    }

    return <Brain size={22}/>;

}

function corIcone(nome){

    const criterio = nome.toLowerCase();

    if(criterio.includes("skill")) return styles.iconSkill;

    if(criterio.includes("cargo")) return styles.iconCargo;

    if(criterio.includes("nível") || criterio.includes("nivel"))
        return styles.iconNivel;

    if(criterio.includes("divers"))
        return styles.iconDiversidade;

    if(criterio.includes("mobil"))
        return styles.iconMobilidade;

    return styles.iconSkill;

}

export default function ModalAnaliseIA({

    aberto,
    onClose,
    candidato

}){

    if(!aberto || !candidato) return null;

    const iniciais = candidato.nome
        .split(" ")
        .map(n=>n[0])
        .slice(0,2)
        .join("");

    const skills = candidato.criterios
        ?.find(c=>c.criterio==="Skills")
        ?.detalhe
        ?.map(item=>{

            const partes=item.split(",");

            return partes[0]
                .replace("skill pretendida","")
                .trim();

        }) ?? [];

    return(

        <div className={styles.overlay}>

            <div className={styles.modal}>

                <button

                    className={styles.fechar}

                    onClick={onClose}

                >

                    <X size={24}/>

                </button>

                {/* HEADER */}

                <header className={styles.header}>

                    <div className={styles.headerIcon}>

                        <Brain size={28}/>

                    </div>

                    <div>

                        <h2>

                            Análise da IA

                        </h2>

                        <p>

                            Entenda como a IA calculou a compatibilidade deste candidato.

                        </p>

                    </div>

                </header>

                {/* CARD SUPERIOR */}

                <section className={styles.topo}>

                    <div className={styles.esquerda}>

                        <div className={styles.avatar}>

                            {iniciais}

                        </div>

                        <div className={styles.info}>

                            <h3>

                                {candidato.nome}

                            </h3>

                            <span>

                                FRONTEND_DEVELOPER

                            </span>

                            <div className={styles.skills}>

                                {skills.map((skill,index)=>(

                                    <span
                                        key={index}
                                    >

                                        {skill}

                                    </span>

                                ))}

                            </div>

                            <p className={styles.resumo}>

                                {candidato.resumo}

                            </p>

                        </div>

                    </div>

                    <div className={styles.scoreArea}>

                        <div className={styles.scoreCircle}>

                            <strong>

                                {Math.round(candidato.score_final)}%

                            </strong>

                            <small>

                                SCORE FINAL

                            </small>

                        </div>

                    </div>

                    <div className={styles.infoExtra}>

                        <div>

                            <span>

                                Posição no ranking

                            </span>

                            <strong>

                                1º de 12

                            </strong>

                        </div>

                        <div>

                            <span>

                                Alta compatibilidade

                            </span>

                            <strong className={styles.verde}>

                                Sim

                            </strong>

                        </div>

                        <div>

                            <span>

                                Diversidade

                            </span>

                            <strong>

                                Grupo prioritário

                            </strong>

                        </div>

                        <div>

                            <span>

                                Analisado em

                            </span>

                            <strong>

                                {new Date().toLocaleDateString("pt-BR")}

                            </strong>

                        </div>

                    </div>

                </section>

                <section className={styles.tituloDetalhes}>

                    <h3>

                        Detalhamento da análise por critérios

                    </h3>

                    <p>

                        Pontuação, peso e contribuição de cada critério para o score final.

                    </p>

                </section>

                {/* A PARTE 2 COMEÇA AQUI COM O MAP DOS CRITÉRIOS */}
                                {

                    candidato.criterios.map((criterio,index)=>(

                        <article

                            key={criterio.criterio}

                            className={styles.cardCriterio}

                        >

                            <div className={`${styles.icone} ${corIcone(criterio.criterio)}`}>

                                {iconeCriterio(criterio.criterio)}

                            </div>

                            <div className={styles.criterioConteudo}>

                                <div className={styles.criterioHeader}>

                                    <div className={styles.criterioDescricao}>

                                        <h4>

                                            {criterio.criterio}

                                        </h4>

                                        <p>

                                            {

                                                criterio.criterio==="Skills"

                                                &&

                                                "Avaliação das skills técnicas exigidas pela vaga e nível de proficiência do candidato."

                                            }

                                            {

                                                criterio.criterio==="Cargo"

                                                &&

                                                "Compatibilidade entre o cargo pretendido pelo candidato e a vaga."

                                            }

                                            {

                                                criterio.criterio==="Nível"

                                                &&

                                                "Compatibilidade entre o nível profissional da vaga e o candidato."

                                            }

                                            {

                                                criterio.criterio==="Diversidade"

                                                &&

                                                "Compatibilidade com os grupos priorizados pela vaga."

                                            }

                                            {

                                                criterio.criterio==="Mobilidade"

                                                &&

                                                "Compatibilidade entre localização, modalidade e requisitos da vaga."

                                            }

                                        </p>

                                    </div>

                                    <div className={styles.metricas}>

                                        <div>

                                            <span>

                                                Nota

                                            </span>

                                            <strong>

                                                {criterio.nota}%

                                            </strong>

                                        </div>

                                        <div>

                                            <span>

                                                Peso

                                            </span>

                                            <strong>

                                                {(criterio.peso*100).toFixed(0)}%

                                            </strong>

                                        </div>

                                        <div>

                                            <span>

                                                Contribuição

                                            </span>

                                            <strong>

                                                {criterio.contribuicao.toFixed(1)} pts

                                            </strong>

                                        </div>

                                        <ChevronDown

                                            size={18}

                                            className={styles.expandir}

                                        />

                                    </div>

                                </div>

                                <div className={styles.barra}>

                                    <div

                                        className={styles.preenchimento}

                                        style={{

                                            width:`${criterio.nota}%`

                                        }}

                                    />

                                </div>

                                <div className={styles.listaDetalhes}>

                                    {

                                        criterio.detalhe.map((item,i)=>(

                                            <span

                                                key={i}

                                                className={styles.detalhe}

                                            >

                                                <strong>

                                                    Destaque:

                                                </strong>

                                                {" "}

                                                {item}

                                            </span>

                                        ))

                                    }

                                </div>

                            </div>

                        </article>

                    ))

                }
                                <footer className={styles.footer}>

                    <div className={styles.rodapeInfo}>

                        <Brain size={18}/>

                        <span>

                            Esta análise foi gerada automaticamente pelo Motor IA da InclusiveTech utilizando critérios técnicos, aderência à vaga e regras de diversidade configuradas.

                        </span>

                    </div>

                    <button

                        className={styles.botaoFechar}

                        onClick={onClose}

                    >

                        Fechar análise

                    </button>

                </footer>

            </div>

        </div>

    );

}