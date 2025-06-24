from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/submissoes", tags=["Submissoes"])

@router.get("/", response_model=list[schemas.Submissao])
def listar_submissoes(skip: int=0, limit: int=100, db: Session=Depends(get_db)):
    return crud.get_submissoes(db, skip, limit)

@router.get("/{submissao_id}", response_model=schemas.Submissao)
def obter_submissao(submissao_id: int, db: Session=Depends(get_db)):
    s = crud.get_submissao(db, submissao_id)
    if not s:
        raise HTTPException(404, "Submissão não encontrada")
    return s

@router.post("/", response_model=schemas.Submissao, status_code=201)
def criar_submissao(s: schemas.SubmissaoCreate, db: Session=Depends(get_db)):
    return crud.create_submissao(db, s)
