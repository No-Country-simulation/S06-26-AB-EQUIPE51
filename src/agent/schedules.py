"""import schedules
import asyncio
from contextlib import asynccontextmanager

schedules.every(1).hour.do(assessmentCandidates)

async def run_schedules():
    while True:
        schedules.run_pending()
        await asyncio.sleep(1)  # Aguarda 1 segundo antes de verificar novamente


@asynccontextmanager
async def lifespan(app):
    # Inicia a execução das tarefas agendadas em segundo plano
    asyncio.create_task(run_schedules())
    yield  # Permite que o FastAPI continue com a inicialização do aplicativo

    """