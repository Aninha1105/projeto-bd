# backend/app/routers/estatisticas.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/estatisticas", tags=["Estatísticas"])

@router.get("/", response_model=list[schemas.EstatisticaRead])
def listar_estatisticas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_estatisticas(db, skip, limit)

@router.get("/{estat_id}", response_model=schemas.EstatisticaRead)
def obter_estatistica(estat_id: int, db: Session = Depends(get_db)):
    est = crud.get_estatistica(db, estat_id)
    if not est:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Estatística não encontrada")
    return est
