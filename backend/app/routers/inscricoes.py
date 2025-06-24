from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/inscricoes", tags=["Inscricoes"])

@router.get("/", response_model=list[schemas.Inscricao])
def listar_inscricoes(skip: int=0, limit: int=100, db: Session=Depends(get_db)):
    return crud.get_inscricoes(db, skip, limit)

@router.get("/{inscricao_id}", response_model=schemas.Inscricao)
def obter_inscricao(inscricao_id: int, db: Session=Depends(get_db)):
    i = crud.get_inscricao(db, inscricao_id)
    if not i:
        raise HTTPException(404, "Inscrição não encontrada")
    return i

@router.post("/", response_model=schemas.Inscricao, status_code=201)
def criar_inscricao(i: schemas.InscricaoCreate, db: Session=Depends(get_db)):
    return crud.create_inscricao(db, i)
