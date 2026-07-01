import httpx
import os
from src.schemas.schemas import Candidato
from typing import List
from dotenv import load_dotenv  

load_dotenv()

NESTJS_URL = os.getenv("NESTJS_URL", "")
NESTJS_TOKEN = os.getenv("NESTJS_TOKEN","" )  # token fixo no .env

async def buscar_candidatos(empresa_id: str, vaga: any) -> List[Candidato]:
    payload = {
        "empresa_id": empresa_id,
        "vaga": {
            "titulo": f"Vaga para {vaga.cargo.replace('_', ' ').title()}",
            "cargo": vaga.cargo,
            "modalidade": vaga.modalidade,
            "skills": vaga.skills,
            "nivel": vaga.nivel,
            "regiao": vaga.regiao,
        }
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{NESTJS_URL}/match",
            headers={
                "Authorization": f"Bearer {NESTJS_TOKEN}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=15.0,
        )
        resp.raise_for_status()
        data = resp.json()

    candidatos = []
    for c in data.get("candidatos", []):  # era "shortlist", agora é "candidatos"
        candidatos.append(Candidato(
            id=c.get("candidato_id", ""),   # era "id", agora é "candidato_id"
            nome=c.get("nome", ""),
            cargoDesejado=c.get("cargoDesejado", vaga.cargo),
            skills=c.get("skills", []),
            nivel=c.get("nivel", "PLENO"),
            regiao=c.get("regiao"),
            grupoDiversidade=c.get("grupoDiversidade"),
            scoreMobilidade=c.get("scoreMobilidade"),
        ))

    return candidatos