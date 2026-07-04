import numpy as np
from typing import List, Tuple
from src.schemas.schemas import Vaga, Candidato, CandidatoScore, CriterioExplicacao, MatchResponse
from .embeddings import get_model, cosine_similarity

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
        return nota, f"vaga pede {n_vaga}, candidato é {n_cand} → nota {nota * 100:.0f}"
    except ValueError:
        return 0.0, f"nível não reconhecido: {n_cand}"


def _score_diversidade(grupo: str | None) -> Tuple[float, str]:
    if grupo:
        return 1.0, f"candidato pertence ao grupo {grupo}"
    return 0.0, "sem grupo de diversidade informado"


def _score_mobilidade(score_mob: int | None, modalidade: str) -> Tuple[float, str]:
    if modalidade.upper() == "REMOTO":
        return 0.0, "mobilidade não aplicável para vaga remota"
    nota = (score_mob or 0) / 100.0
    return nota, f"score de mobilidade {score_mob or 0}/100"


def _avaliar_com_embs(
    vaga: Vaga,
    cand: Candidato,
    emb_cargo_vaga: np.ndarray,
    embs_skills_vaga: List[np.ndarray],
    emb_cargo_cand: np.ndarray,
    embs_skills_cand: List[np.ndarray],
) -> CandidatoScore:
    pesos = PESOS.get(vaga.modalidade.upper(), PESOS["REMOTO"])
    criterios = []

    # --- Skills ---
    det_skills = []
    notas_skills = []

    if not embs_skills_vaga or not embs_skills_cand:
        # candidato ou vaga sem skills
        det_skills = ["sem skills para comparar"]
        notas_skills = [0.0]
    else:
        for i, skill_vaga in enumerate(vaga.skills):
            sims = [
                (cand.skills[j], cosine_similarity(embs_skills_vaga[i], embs_skills_cand[j]))
                for j in range(len(embs_skills_cand))
            ]
            melhor_skill, melhor_sim = max(sims, key=lambda x: x[1])
            notas_skills.append(melhor_sim)
            det_skills.append(
                f"skill pretendida {skill_vaga}, candidato tem {melhor_skill} nota {melhor_sim * 100:.0f}"
            )

    s_skills = float(np.mean(notas_skills)) if notas_skills else 0.0
    criterios.append(CriterioExplicacao(
        criterio="Skills",
        nota=round(s_skills * 100, 1),
        peso=pesos["skills"],
        contribuicao=round(s_skills * pesos["skills"] * 100, 1),
        detalhe=det_skills,
    ))

    # --- Cargo ---
    s_cargo = cosine_similarity(emb_cargo_vaga, emb_cargo_cand)
    criterios.append(CriterioExplicacao(
        criterio="Cargo",
        nota=round(s_cargo * 100, 1),
        peso=pesos["cargo"],
        contribuicao=round(s_cargo * pesos["cargo"] * 100, 1),
        detalhe=[f"cargo pretendido {vaga.cargo}, candidato tem {cand.cargoDesejado} nota {s_cargo * 100:.0f}"],
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
    

def run_scoring(vaga: Vaga, candidatos: List[Candidato], diversidade_minima: float) -> MatchResponse:
    elegiveis = [c for c in candidatos if c.cargoDesejado.upper() == vaga.cargo.upper()]

    if not elegiveis:
        return MatchResponse(shortlist=[], diversidade_alcancada=0.0, total_analisados=0)

    model = get_model()

    # batch único — uma só chamada ao modelo pra tudo
    todas_strings = [vaga.cargo.replace("_", " ")] + [s for s in vaga.skills]
    for c in elegiveis:
        todas_strings.append(c.cargoDesejado.replace("_", " "))
        todas_strings += c.skills

    todas_embs = list(model.embed(todas_strings))

    # distribui embeddings por índice
    idx = 0
    emb_cargo_vaga = todas_embs[idx]; idx += 1
    embs_skills_vaga = todas_embs[idx:idx + len(vaga.skills)]; idx += len(vaga.skills)

    cand_embs = []
    for c in elegiveis:
        emb_cargo = todas_embs[idx]; idx += 1
        embs_skills = todas_embs[idx:idx + len(c.skills)]; idx += len(c.skills)
        cand_embs.append((emb_cargo, embs_skills))

    # avalia sem chamar o modelo de novo
    scores = [
    _avaliar_com_embs(vaga, c, emb_cargo_vaga, embs_skills_vaga, *cand_embs[i])
    for i, c in enumerate(elegiveis)
]

# remove None caso algum candidato falhe
    scores = [s for s in scores if s is not None]

    scores.sort(key=lambda x: x.score_final, reverse=True)

    scores.sort(key=lambda x: x.score_final, reverse=True)
    shortlist = scores[:10]

    ids_shortlist = {s.id for s in shortlist}
    com_div = sum(1 for c in elegiveis if c.id in ids_shortlist and c.grupoDiversidade)
    total = len(shortlist)
    diversidade_alcancada = round((com_div / total * 100) if total else 0.0, 1)

    return MatchResponse(
        shortlist=shortlist,
        diversidade_alcancada=diversidade_alcancada,
        total_analisados=len(elegiveis),
    )