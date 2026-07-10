from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from src.schemas.schemas import MatchRequest, MatchResponse, Candidato
from src.client.client import buscar_candidatos
from src.agent.agent import rodar_agente, get_llm
from src.agent.embeddings import get_model
import requests

@asynccontextmanager
async def lifespan(app: FastAPI):
    get_model()   # carrega all-MiniLM-L6-v2
    get_llm()     # aquece o Qwen
    yield

app = FastAPI(title="App-BiT AI Scoring Agent", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


"""
def _candidatos_mock() -> list[Candidato]:
    return [
        Candidato(
            id="mock-123",
            nome="Silva",
            cargoDesejado="FRONTEND_DEVELOPER",
            skills=["React", "TypeScript", "TailwindCSS"],
            nivel="PLENO",
            regiao="São Paulo",
            grupoDiversidade="MULHER",
            scoreMobilidade=80,
        ),
        Candidato(
            id="mock-000",
            nome="Souza",
            cargoDesejado="FRONTEND_DEVELOPER",
            skills=["Vue", "JavaScript", "CSS"],
            nivel="PLENO",
            regiao="Rio de Janeiro",
            grupoDiversidade=None,
            scoreMobilidade=60,
        ),
        Candidato(
            id="mock-003",
            nome="Ana Lima",
            cargoDesejado="FRONTEND_DEVELOPER",
            skills=["React", "Next.js", "TypeScript", "Styled Components"],
            nivel="SENIOR",
            regiao="Remoto",
            grupoDiversidade="MULHER",
            scoreMobilidade=90,
        ),
        Candidato(
            id="mock-004",
            nome="Beatriz Santos",
            cargoDesejado="FRONTEND_DEVELOPER",
            skills=["Angular", "TypeScript", "RxJS"],
            nivel="JUNIOR",
            regiao="Curitiba",
            grupoDiversidade="PCD",
            scoreMobilidade=50,
        ),
        Candidato(
            id="mock-005",
            nome="Carlos Mendes",
            cargoDesejado="FRONTEND_DEVELOPER",
            skills=["React", "Redux", "JavaScript", "TailwindCSS"],
            nivel="PLENO",
            regiao="Florianópolis",
            grupoDiversidade=None,
            scoreMobilidade=70,
        ),
        Candidato(
            id="mock-006",
            nome="Fernanda Rocha",
            cargoDesejado="FRONTEND_DEVELOPER",
            skills=["Svelte", "JavaScript", "CSS", "Figma"],
            nivel="PLENO",
            regiao="Belo Horizonte",
            grupoDiversidade="MULHER",
            scoreMobilidade=65,
        ),
        Candidato(
            id="mock-007",
            nome="Rafael Nunes",
            cargoDesejado="FRONTEND_DEVELOPER",
            skills=["React", "TypeScript", "GraphQL", "Next.js"],
            nivel="SENIOR",
            regiao="Remoto",
            grupoDiversidade=None,
            scoreMobilidade=85,
        ),
        Candidato(
            id="mock-008",
            nome="Luciana Ferreira",
            cargoDesejado="FRONTEND_DEVELOPER",
            skills=["Vue", "Nuxt.js", "TypeScript", "TailwindCSS"],
            nivel="PLENO",
            regiao="Porto Alegre",
            grupoDiversidade="MULHER",
            scoreMobilidade=75,
        ),
        Candidato(
            id="mock-009",
            nome="Diego Alves",
            cargoDesejado="BACKEND_DEVELOPER",  # cargo diferente — deve ser filtrado
            skills=["NestJS", "PostgreSQL", "Docker"],
            nivel="PLENO",
            regiao="São Paulo",
            grupoDiversidade=None,
            scoreMobilidade=70,
        ),
        Candidato(
            id="mock-010",
            nome="Camila Torres",
            cargoDesejado="FRONTEND_DEVELOPER",
            skills=["React", "TypeScript", "TailwindCSS", "Storybook"],
            nivel="JUNIOR",
            regiao="Recife",
            grupoDiversidade="LGBTQIA+",
            scoreMobilidade=55,
        ),
    ]

@app.post("/match", response_model=MatchResponse)
async def match(body: MatchRequest) -> MatchResponse:
    # troca buscar_candidatos por mock para testar
    candidatos = _candidatos_mock()
    return await rodar_agente(body.vaga, candidatos)

"""

@app.post("/match", response_model=MatchResponse)
async def match(body: MatchRequest) -> MatchResponse:
    try:
        candidatos = await buscar_candidatos(empresa_id=body.empresa_id, vaga=body.vaga)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Erro ao buscar candidatos: {str(e)}")

    if not candidatos:
        raise HTTPException(status_code=404, detail="Nenhum candidato encontrado.")

    return await rodar_agente(body.vaga, candidatos)


@app.get("/health")
def health():
    return {"status": "ok"}



from fastapi import Request

@app.post("/debug_match")
async def match(request: Request):
    # 1. Captura exatamente o que o cliente (Postman/Frontend) enviou, sem validações
    try:
        corpo_bruto = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="O corpo da requisição não é um JSON válido.")

    # 2. Imprime no log do Uvicorn
    print("\n" + "="*50)
    print("🚨 DEBUG: O QUE REALMENTE CHEGOU NO SERVIDOR 🚨")
    print(corpo_bruto)
    print("="*50 + "\n")

    # 3. Retorna o próprio payload para a tela de quem chamou
    return {
        "mensagem": "Verifique o terminal do Python! O titulo estava aqui?",
        "payload_recebido": corpo_bruto
    }
