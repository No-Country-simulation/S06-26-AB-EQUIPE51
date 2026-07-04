import numpy as np
from typing import List, Tuple
from src.schemas.schemas import Vaga, Candidato, CandidatoScore, CriterioExplicacao, MatchResponse
from .embeddings import embed, cosine_similarity

PESOS = {
    "REMOTO":     {"cargo": 0.35, "skills": 0.40, "nivel": 0.15, "diversidade": 0.10, "mobilidade": 0.00},
    "HIBRIDO":    {"cargo": 0.30, "skills": 0.35, "nivel": 0.15, "diversidade": 0.10, "mobilidade": 0.10},
    "PRESENCIAL": {"cargo": 0.25, "skills": 0.30, "nivel": 0.15, "diversidade": 0.10, "mobilidade": 0.20},
}

NIVEIS = ["JUNIOR", "PLENO", "SENIOR", "LEAD"]


def _score_nivel(n_vaga: str, n_cand: str) -> Tuple[float, str]:
    try:
        i_vaga = NIVEIS.index(n_vaga.upper())
        i_cand = NIVEIS.index(n_cand.upper())
        nota = max(0.0, 1.0 - abs(i_vaga - i_cand) * 0.35)
        detalhe = f"vaga pede {n_vaga}, candidato é {n_cand} → nota {nota * 100:.0f}"
        return nota, detalhe
    except ValueError:
        return 0.0, f"nível não reconhecido: {n_cand}"


def _score_skills(
    skills_vaga: List[str],
    skills_cand: List[str],
) -> Tuple[float, List[str]]:
    if not skills_vaga:
        return 1.0, ["nenhuma skill exigida"]
    if not skills_cand:
        return 0.0, ["candidato sem skills cadastradas"]

    embs_cand = [(s, embed(s)) for s in skills_cand]
    detalhes = []
    notas = []

    for skill_vaga in skills_vaga:
        emb_vaga = embed(skill_vaga)
        sims = [(s, cosine_similarity(emb_vaga, emb)) for s, emb in embs_cand]
        melhor_skill, melhor_sim = max(sims, key=lambda x: x[1])
        nota = round(melhor_sim * 100, 1)
        notas.append(melhor_sim)
        detalhes.append(
            f"skill pretendida {skill_vaga}, candidato tem {melhor_skill} nota {nota:.0f}"
        )

    return float(np.mean(notas)), detalhes


def _score_cargo(cargo_vaga: str, cargo_cand: str) -> Tuple[float, str]:
    emb_v = embed(cargo_vaga.replace("_", " "))
    emb_c = embed(cargo_cand.replace("_", " "))
    nota = cosine_similarity(emb_v, emb_c)
    return nota, f"cargo pretendido {cargo_vaga}, candidato tem {cargo_cand} nota {nota * 100:.0f}"


def _score_diversidade(grupo: str | None) -> Tuple[float, str]:
    if grupo:
        return 1.0, f"candidato pertence ao grupo {grupo}"
    return 0.0, "candidato sem grupo de diversidade informado"


def _score_mobilidade(score_mob: int | None, modalidade: str) -> Tuple[float, str]:
    if modalidade.upper() == "REMOTO":
        return 0.0, "mobilidade não aplicável para vaga remota"
    nota = (score_mob or 0) / 100.0
    return nota, f"score de mobilidade {score_mob or 0}/100"


def _avaliar_candidato(vaga: Vaga, cand: Candidato) -> CandidatoScore:
    pesos = PESOS.get(vaga.modalidade.upper(), PESOS["REMOTO"])
    criterios = []

    # --- Skills ---
    s_skills, det_skills = _score_skills(vaga.skills, cand.skills)
    criterios.append(CriterioExplicacao(
        criterio="Skills",
        nota=round(s_skills * 100, 1),
        peso=pesos["skills"],
        contribuicao=round(s_skills * pesos["skills"] * 100, 1),
        detalhe=det_skills,
    ))

    # --- Cargo ---
    s_cargo, det_cargo = _score_cargo(vaga.cargo, cand.cargoDesejado)
    criterios.append(CriterioExplicacao(
        criterio="Cargo",
        nota=round(s_cargo * 100, 1),
        peso=pesos["cargo"],
        contribuicao=round(s_cargo * pesos["cargo"] * 100, 1),
        detalhe=[det_cargo],
    ))

    # --- Nível ---
    s_nivel, det_nivel = _score_nivel(vaga.nivel, cand.nivel)
    criterios.append(CriterioExplicacao(
        criterio="Nível",
        nota=round(s_nivel * 100, 1),
        peso=pesos["nivel"],
        contribuicao=round(s_nivel * pesos["nivel"] * 100, 1),
        detalhe=[det_nivel],
    ))

    # --- Diversidade ---
    s_div, det_div = _score_diversidade(cand.grupoDiversidade)
    criterios.append(CriterioExplicacao(
        criterio="Diversidade",
        nota=round(s_div * 100, 1),
        peso=pesos["diversidade"],
        contribuicao=round(s_div * pesos["diversidade"] * 100, 1),
        detalhe=[det_div],
    ))

    # --- Mobilidade ---
    s_mob, det_mob = _score_mobilidade(cand.scoreMobilidade, vaga.modalidade)
    criterios.append(CriterioExplicacao(
        criterio="Mobilidade",
        nota=round(s_mob * 100, 1),
        peso=pesos["mobilidade"],
        contribuicao=round(s_mob * pesos["mobilidade"] * 100, 1),
        detalhe=[det_mob],
    ))

    score_final = round(sum(c.contribuicao for c in criterios), 1)

    return CandidatoScore(
        id=cand.id,
        nome=cand.nome,
        score_final=score_final,
        criterios=criterios,
    )


def run_scoring(
    vaga: Vaga,
    candidatos: List[Candidato],
    diversidade_minima: float,
) -> MatchResponse:
    # filtra só quem tem o cargo compatível
    elegiveis = [c for c in candidatos if c.cargoDesejado.upper() == vaga.cargo.upper()]

    scores = [_avaliar_candidato(vaga, c) for c in elegiveis]
    scores.sort(key=lambda x: x.score_final, reverse=True)
    shortlist = scores[:10]

    total = len(shortlist)
    com_div = sum(
        1 for c in elegiveis
        if c.id in {s.id for s in shortlist} and c.grupoDiversidade
    )
    diversidade_alcancada = round((com_div / total * 100) if total else 0.0, 1)

    return MatchResponse(
        shortlist=shortlist,
        diversidade_alcancada=diversidade_alcancada,
        total_analisados=len(elegiveis),
    )