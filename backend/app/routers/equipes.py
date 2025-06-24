from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/equipes", tags=["Equipes"])

@router.get("/", response_model=list[schemas.Equipe])
def listar_equipes(skip: int=0, limit: int=100, db: Session=Depends(get_db)):
    return crud.get_equipes(db, skip, limit)

@router.get("/{equipe_id}", response_model=schemas.Equipe)
def obter_equipe(equipe_id: int, db: Session=Depends(get_db)):
    e = crud.get_equipe(db, equipe_id)
    if not e:
        raise HTTPException(404, "Equipe não encontrada")
    return e

@router.post("/", response_model=schemas.Equipe, status_code=201)
def criar_equipe(e: schemas.EquipeCreate, db: Session=Depends(get_db)):
    return crud.create_equipe(db, e)
