from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from src.schemas.schemas import MatchRequest, MatchResponse
from src.agent.scoring import run_scoring
from src.client.client import buscar_candidatos
from src.agent.embeddings import get_model
from prometheus_fastapi_instrumentator import Instrumentator
"""from src.agent.schedules import schedule_tasks"""
import psutil
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    get_model()  # carrega modelo na inicialização
    yield

app = FastAPI(title="App-BiT AI Scoring Agent", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrinja para o domínio do front em produção
    allow_methods=["*"],
    allow_headers=["*"],
)


Instrumentator().instrument(app).expose(app)

@app.post("/match", response_model=MatchResponse)
async def match(body: MatchRequest) -> MatchResponse:
    try:
        candidatos = await buscar_candidatos(empresa_id=body.empresa_id, vaga=body.vaga)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Erro ao buscar candidatos no NestJS: {str(e)}")

    if not candidatos:
        raise HTTPException(status_code=404, detail="Nenhum candidato elegível encontrado para este cargo.")

    return run_scoring(
        vaga=body.vaga,
        candidatos=candidatos,
        diversidade_minima=body.diversidade_minima or 0.0,
    )

@app.get("/health")
def health():
    return {"status": "ok"}

"""nestjsUrl": os.getenv("NESTJS_URL", "Não encontrado"),
"nestjsToken": os.getenv("NESTJS_TOKEN", "Não encontrado"""


@app.get("/ram")
def get_ram_usage():
    process = psutil.Process(os.getpid())
    ram_bytes = process.memory_info().rss  # Resident Set Size (RAM real instalada)
    ram_mb = ram_bytes / (1024 * 1024)     # Converte para Megabytes
    return {"ram_utilizada_mb": round(ram_mb, 2)}

"""
@app.get("/notification")

"""