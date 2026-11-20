from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.config import settings
from src.routers import catalogos, trabajadores
#FILTROS INICIO, en importaciones de main.py
from src.routers import reportes
#FILTROS FIN


app = FastAPI(
    title="API SARHHRRS - Gestión de Personal",
    description="API transaccional para registro y consulta consolidada de trabajadores",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "*"],
    #allow_origins=[settings.FRONTEND_URL, "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trabajadores.router, prefix="/api/v1")
app.include_router(catalogos.router, prefix="/api/v1")
#FILTROS INICIO, en declaracion de rutas de main.py
#app.include_router(reportes.router, prefix="/api/v1")
#FILTROS FIN

@app.get("/")
def health_check():
    return {"status": "ok", "servicio": "API SARHHRRS operativa"}
