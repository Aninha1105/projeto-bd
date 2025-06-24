from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/competicoes", tags=["Competicoes"])

@router.get("/", response_model=list[schemas.CompeticaoRead])
def listar_competicoes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_competicoes(db, skip, limit)

@router.get("/{comp_id}", response_model=schemas.CompeticaoRead)
def obter_competicao(comp_id: int, db: Session = Depends(get_db)):
    comp = crud.get_competicao(db, comp_id)
    if not comp:
        raise HTTPException(status_code=404, detail="Competição não encontrada")
    return comp

@router.post("/", response_model=schemas.CompeticaoRead, status_code=201)
def criar_competicao(comp: schemas.CompeticaoCreate, db: Session = Depends(get_db)):
    return crud.create_competicao(db, comp)
