import logging
import json
import ast
import asyncio
import os
from click import prompt
from dotenv import load_dotenv

from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage
from src.schemas.schemas import Vaga, Candidato, CandidatoScore, CriterioExplicacao, MatchResponse
from .tools import executar_match, set_contexto
import re

load_dotenv()

logger = logging.getLogger(__name__)

_llm = None

def get_llm():
    global _llm
    if _llm is None:
        _llm = ChatOllama(
            model=os.getenv("OLLAMA_MODEL", "qwen2.5:1.5b"),
            base_url=os.getenv("OLLAMA_URL"),
            temperature=0.1,
            num_predict=300, 
            keep_alive=True, # Mantém a conexão viva para múltiplas chamadas
            timeout=15.0, # Timeout de 15 segundos para cada chamada
        )
    return _llm


import asyncio

async def _gerar_resumos_com_llm(data: dict) -> dict:
    """Versão Sequencial e com Prints para Debug"""
    shortlist = data.get("shortlist", [])
    if not shortlist:
        return {}

    resultados = {}
    print("\n" + "="*50)
    print(f"🚀 INICIANDO GERAÇÃO DE {len(shortlist)} RESUMOS...")
    
    for c in shortlist:
        nome = c["nome"]
        print(f"⏳ Pedindo resumo para: {nome}...")
        
        prompt = (
            "Você é um recrutador especialista. Escreva um resumo de no máximo 3 linhas justificando "
            "o score deste candidato com base nos detalhes abaixo.\n"
            "Responda APENAS com o texto do resumo, sem formatação JSON.\n\n"
            f"Nome: {nome}\n"
            f"Score: {c['score_final']}\n"
            f"Detalhes: {[cr['detalhe'][0] for cr in c['criterios'] if cr.get('detalhe')]}"
        )
        
        try:
            # Chama o LLM e espera a resposta
            result = get_llm().invoke([HumanMessage(content=prompt)])            
            resultados[c["id"]] = result.content.strip()
            print(f"✅ Resumo concluído para: {nome}")
            
        except Exception as e:
            logger.warning(f"Erro ao gerar resumo para {nome}: {e}")
            resultados[c["id"]] = "Resumo não disponível."
            print(f"❌ Erro no resumo de {nome}: {e}")

    print("🏁 TODOS OS RESUMOS GERADOS COM SUCESSO!")
    print("="*50 + "\n")
    return resultados

def _montar_response(data: dict, resumos: dict) -> MatchResponse:
    shortlist = []
    
    for c in data.get("shortlist", []):
        criterios = [
            CriterioExplicacao(
                criterio=cr.get("criterio", ""),
                nota=cr.get("nota", 0.0),
                peso=cr.get("peso", 0.0),
                contribuicao=cr.get("contribuicao", 0.0),
                detalhe=cr.get("detalhe", []),
            )
            for cr in c.get("criterios", [])
        ]
        
        # Puxa o resumo gerado pelo LLM usando o ID do candidato.
        # Se falhar, coloca um texto padrão.
        id_candidato = c.get("id", "")
        texto_resumo = resumos.get(id_candidato, "Resumo não disponível para este candidato.")
        
        shortlist.append(CandidatoScore(
            id=id_candidato,
            nome=c.get("nome", ""),
            resumo=texto_resumo,
            score_final=c.get("score_final", 0.0),
            criterios=criterios,
        ))

    return MatchResponse(
        shortlist=shortlist,
        diversidade_alcancada=data.get("diversidade_alcancada", 0.0),
        total_analisados=data.get("total_analisados", 0)
    )


async def rodar_agente(vaga: Vaga, candidatos: list[Candidato]) -> MatchResponse:
    set_contexto(vaga, candidatos)

    # 1. Executa a tool de match (Python puro, garante a matemática exata)
    resultado_raw = executar_match.invoke({
        "cargo": vaga.cargo,
        "skills": vaga.skills,
        "modalidade": vaga.modalidade,
        "nivel": vaga.nivel,
    })

    # 2. Converte a string retornada pela tool de volta para um dicionário Python
    try:
        data = ast.literal_eval(resultado_raw)
    except Exception as e:
        logger.error(f"Erro ao parsear resultado da tool: {e}")
        return MatchResponse(shortlist=[], diversidade_alcancada=0.0, total_analisados=0)

    # 3. Se a lista de candidatos estiver vazia, encerra a operação rapidamente
    if not data.get("shortlist"):
        logger.info("A tool retornou uma shortlist vazia.")
        return MatchResponse(shortlist=[], diversidade_alcancada=0.0, total_analisados=0)

    # 4. A mágica acontece aqui: O LLM gera os resumos baseados nos dados processados
    resumos_gerados = await _gerar_resumos_com_llm(data)

    # 5. Monta a resposta final, injetando o resumo entre o score_final e os critérios
    return _montar_response(data, resumos_gerados)