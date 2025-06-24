# backend/app/routers/equipes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/equipes", tags=["Equipes"])

@router.get("/", response_model=list[schemas.EquipeRead])
def listar_equipes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_equipes(db, skip, limit)

@router.get("/{equipe_id}", response_model=schemas.EquipeRead)
def obter_equipe(equipe_id: int, db: Session = Depends(get_db)):
    eq = crud.get_equipe(db, equipe_id)
    if not eq:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Equipe não encontrada")
    return eq

@router.post("/", response_model=schemas.EquipeRead, status_code=status.HTTP_201_CREATED)
def criar_equipe(equipe: schemas.EquipeCreate, db: Session = Depends(get_db)):
    return crud.create_equipe(db, equipe)