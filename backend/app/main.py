from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from . import models
from .routers import (competicoes, usuarios, equipes, inscricoes, problemas,
                      submissoes, estatisticas, colaboradores, participantes,
                      patrocinadores, auth)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Marathon Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(competicoes.router)
app.include_router(usuarios.router)
app.include_router(equipes.router)
app.include_router(inscricoes.router)
app.include_router(problemas.router)
app.include_router(submissoes.router)
app.include_router(estatisticas.router)
app.include_router(colaboradores.router)
app.include_router(participantes.router)
app.include_router(patrocinadores.router)
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "API está no ar!"}
