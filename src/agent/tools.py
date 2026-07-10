import logging
from typing import List
from langchain_core.tools import tool
from src.schemas.schemas import Vaga, Candidato
from .scoring import run_scoring, PESOS
from contextvars import ContextVar

logger = logging.getLogger(__name__)

# Estado compartilhado — preenchido antes de rodar o agente
_candidatos_cache: ContextVar[List[Candidato]] = ContextVar("_candidatos_cache", default=[])
_vaga_cache: ContextVar[Vaga] = ContextVar("_vaga_cache", default=None)

def set_contexto(vaga: Vaga, candidatos: List[Candidato]):
    global _candidatos_cache, _vaga_cache
    _vaga_cache.set(vaga)
    _candidatos_cache.set(candidatos)

def _validar(shortlist) -> list[str]:
    avisos = []
    if not shortlist:
        avisos.append("Nenhum candidato elegível encontrado.")
        return avisos
        
    # Lê usando chaves de dicionário: c["score_final"] em vez de c.score_final
    if all(c["score_final"] > 95 for c in shortlist):
        avisos.append("Todos os scores acima de 95 — dados possivelmente homogêneos.")
        
    com_div = sum(1 for c in shortlist if any(
        cr["criterio"] == "Diversidade" and cr["nota"] > 0 for cr in c["criterios"]
    ))
    
    if com_div == 0:
        avisos.append("Nenhum candidato diverso na shortlist.")
        
    for c in shortlist:
        nivel_cr = next((cr for cr in c["criterios"] if cr["criterio"] == "Nível"), None)
        if nivel_cr and nivel_cr["nota"] < 30:
            avisos.append(f"{c['nome']} tem nível muito distante da vaga.")
            
    return avisos

@tool
def executar_match(cargo: str, skills: List[str], modalidade: str, nivel: str) -> str:
    """
    Executa o pipeline completo de matching.
    Use esta tool uma única vez passando os dados da vaga.
    """
    # 1. Recupera os dados do cache
    candidatos_atuais = _candidatos_cache.get()
    vaga_atual = _vaga_cache.get()

    if not candidatos_atuais:
        return str({
            "shortlist": [], 
            "total_analisados": 0, 
            "diversidade_alcancada": 0.0, 
            "avisos": ["Cache de candidatos vazio."]
        })

    # 2. Constrói a vaga garantindo os dados que o agente não envia na tool
    vaga = Vaga(
        cargo=cargo,
        titulo=vaga_atual.titulo if vaga_atual and vaga_atual.titulo else "Título não informado",
        modalidade=modalidade,
        skills=skills,
        nivel=nivel,
        regiao=vaga_atual.regiao if vaga_atual else None,
    )

    # 3. Filtra os elegíveis
    elegiveis = [
        c for c in candidatos_atuais
        if c.cargoDesejado.upper() == cargo.upper()
    ]

    if not elegiveis:
        return str({
            "shortlist": [],
            "total_analisados": 0,
            "diversidade_alcancada": 0.0,
            "avisos": [f"Nenhum candidato para o cargo {cargo}."],
        })

    # 4. Roda o motor de regras base do Python
    resultado = run_scoring(vaga, elegiveis, diversidade_minima=0.0)

    # 5. Mescla as informações do NestJS na Shortlist final
    candidatos_originais = {c.id: c for c in elegiveis}
    shortlist = []

    for c_score in resultado.shortlist:
        criterios_formatados = []
        c_orig = candidatos_originais.get(c_score.id)
        c_orig = candidatos_originais.get(c_score.id)
        
        # 👇 ADICIONE ESTAS DUAS LINHAS 👇
        #print(f"\n🚨 [DEBUG 1] MESCLANDO: {c_score.nome} | Achou original no dicionário? {c_orig is not None}")
        #if c_orig:
            #print(f"🚨 [DEBUG 2] DADOS NESTJS SALVOS: mob={getattr(c_orig, 'scoreMobilidade', None)}, div={getattr(c_orig, 'diversidadeCompativel', None)}, exp={getattr(c_orig, 'explicacao_backend', [])}")
        
        # Extrai os dados puros do backend NestJS com blindagem total usando getattr()
        if c_orig:
            explicacoes = getattr(c_orig, "explicacao_backend", []) or []
            grupos = getattr(c_orig, "grupoDiversidade", [])
            diversidade_comp = getattr(c_orig, "diversidadeCompativel", False)
            
            frase_div = next((f for f in explicacoes if "Grupo" in f), "Diversidade avaliada pelo backend")
            frase_mob = next((f for f in explicacoes if "score de mobilidade" in f.lower() or "remota" in f.lower()), "Mobilidade avaliada pelo backend")
            
            if grupos:
                nomes_grupos = ", ".join(grupos)
                texto_final_diversidade = f"{frase_div} (Grupos: {nomes_grupos})"
            else:
                # Se veio vazio, assumimos apenas a frase do NestJS para não gerar contradição
                texto_final_diversidade = frase_div
            
            nota_div = 100.0 if diversidade_comp else 0.0
            
            # --- CORREÇÃO DA MOBILIDADE ---
            nota_mob = float(getattr(c_orig, "scoreMobilidade", 0.0))
            if nota_mob == 0.0:
                import re
                # Caça números logo depois da palavra "mobilidade:" (ex: "Score de mobilidade: 90")
                match_mob = re.search(r"mobilidade:\s*(\d+)", frase_mob, re.IGNORECASE)
                if match_mob:
                    nota_mob = float(match_mob.group(1))

        # Reconstrói os critérios
        for cr in c_score.criterios:
            if cr.criterio == "Diversidade":
                criterios_formatados.append({
                    "criterio": "Diversidade",
                    "nota": nota_div,
                    "peso": cr.peso,
                    "contribuicao": nota_div * cr.peso,
                    "detalhe": [texto_final_diversidade]
                })
                print(f"🚨 [DEBUG 3] TEXTO INJETADO NA DIVERSIDADE: {texto_final_diversidade}")
                
            elif cr.criterio == "Mobilidade":
                criterios_formatados.append({
                    "criterio": "Mobilidade",
                    "nota": nota_mob, 
                    "peso": cr.peso,
                    "contribuicao": nota_mob * cr.peso,
                    "detalhe": [frase_mob]
                })
                
            else:
                # Mantém Skills, Cargo e Nível inalterados
                criterios_formatados.append({
                    "criterio": cr.criterio,
                    "nota": cr.nota,
                    "peso": cr.peso,
                    "contribuicao": cr.contribuicao,
                    "detalhe": cr.detalhe,
                })

        # Recalcula o score final
        novo_score_final = sum(cr["contribuicao"] for cr in criterios_formatados)

        shortlist.append({
            "id": c_score.id,
            "nome": c_score.nome,
            "score_final": round(novo_score_final, 1),
            "criterios": criterios_formatados
        })

    # 6. Roda a validação para gerar os avisos
    avisos = _validar(shortlist)
    
    # 7. Recalcula a porcentagem de diversidade real
    qtd_diversos = sum(1 for c in shortlist if any(cr["criterio"] == "Diversidade" and cr["nota"] > 0 for cr in c["criterios"]))
    diversidade_real = (qtd_diversos / len(shortlist) * 100) if shortlist else 0.0

    # Retorna como string (JSON) para o Agente LLM ler
    return str({
        "shortlist": shortlist,
        "total_analisados": resultado.total_analisados,
        "diversidade_alcancada": round(diversidade_real, 1),
        "avisos": avisos,
    })