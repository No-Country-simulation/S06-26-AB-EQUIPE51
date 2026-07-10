import httpx
import os
from src.schemas.schemas import Candidato
from typing import List
from dotenv import load_dotenv  
import re
load_dotenv()

NESTJS_URL = os.getenv("NESTJS_URL", "")
NESTJS_TOKEN = os.getenv("NESTJS_TOKEN","" )  # token fixo no .env

async def buscar_candidatos(empresa_id: str, vaga: any) -> List[Candidato]:
    payload = {
        "empresa_id": empresa_id,
        "vaga": {
            "titulo": vaga.titulo,
            "cargo": vaga.cargo,
            "modalidade": vaga.modalidade,
            "skills": vaga.skills,
            "nivel": vaga.nivel,
            "regiao": vaga.regiao,
            "latitude": -27.590569, 
            "longitude": -48.547576,
        }, 
        "filtros":{
            "anti_vies": True,
            "diversidade_minima": 80
            }
        }
    print ("=== PAYLOAD ===")
    print(payload)
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
        if resp.status_code == 400:
            print("ERRO DE VALIDAÇÃO DO NESTJS:", resp.json()) # ISSO TE DARÁ A RESPOSTA EXATA!
            
        resp.raise_for_status()
        data = resp.json()

    print("=== RESPOSTA NESTJS ===")
 #   print(data)
    print("======================")

    candidatos = []
    print("=== RESPOSTA NESTJS ===")
    print("======================")

    candidatos = []
    
    # O NestJS do seu código original retorna a chave "candidatos", não "shortlist".
    # Estamos usando um fallback (get duplo) caso você tenha alterado o backend.
    lista_de_retorno = data.get("candidatos", data.get("shortlist", []))
    try:
        for c in lista_de_retorno:
        # Extrai os dados diretamente da raiz do objeto que o NestJS enviou
            cargo_extraido = c.get("cargoDesejado", vaga.cargo)
            skills_extraidas = c.get("skills", [])
            grupo_diversidade = c.get("gruposDiversidade", [])
            
            # ATENÇÃO: Fallbacks caso o seu NestJS não retorne esses campos na raiz
            nivel_extraido = c.get("nivel", "PLENO") 
            regiao_extraida = c.get("regiao", None)
            score_mob_extraido = c.get("scoreMobilidade", 0)

            candidatos.append(Candidato(
                id=c.get("candidato_id", c.get("id", "")), # NestJS usa candidato_id
                nome=c.get("nome", ""),
                cargoDesejado=cargo_extraido,
                skills=skills_extraidas,
                nivel=nivel_extraido,
                regiao=regiao_extraida,
                grupoDiversidade=grupo_diversidade,
                scoreMobilidade=score_mob_extraido,
                
                # 👇 --- CAMPOS NOVOS PARA A EXPLICAÇÃO DO BACKEND --- 👇
                diversidadeCompativel=c.get("diversidadeCompativel", False),
                explicacao_backend=c.get("explicacao", []),
            ))

        print(f"=== TOTAL DE CANDIDATOS RETORNADOS: {len(candidatos)} ===")

    except Exception as e:
        print("ERRO AO PROCESSAR CANDIDATOS:", str(e))
        raise
    print(f"=== TOTAL DE CANDIDATOS RETORNADOS: {len(candidatos)} ===")
    return candidatos