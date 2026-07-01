from pydantic import BaseModel
from typing import List, Optional

class Vaga(BaseModel):
    cargo: str
    modalidade: str
    skills: List[str]
    nivel: str
    regiao: Optional[str] = None

class Candidato(BaseModel):
    id: str
    nome: str
    cargoDesejado: str
    skills: List[str]
    nivel: str
    regiao: Optional[str] = None
    grupoDiversidade: Optional[str] = None
    scoreMobilidade: Optional[int] = None

class SkillExplicacao(BaseModel):
    skill_vaga: str
    skill_candidato: str
    nota: float             # 0–100

class CriterioExplicacao(BaseModel):
    criterio: str           # "Skills", "Cargo", "Nível", "Diversidade", "Mobilidade"
    nota: float             # 0–100
    peso: float             # peso aplicado conforme modalidade
    contribuicao: float     # nota * peso
    detalhe: List[str]      # explicações legíveis

class CandidatoScore(BaseModel):
    id: str
    nome: str
    score_final: float      # 0–100
    criterios: List[CriterioExplicacao]

class MatchRequest(BaseModel):
    empresa_id: str
    vaga: Vaga
    diversidade_minima: Optional[float] = 0.0

class MatchResponse(BaseModel):
    shortlist: List[CandidatoScore]
    diversidade_alcancada: float
    total_analisados: int