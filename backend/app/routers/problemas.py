# backend/app/routers/problemas.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/problemas", tags=["Problemas"])

@router.get("/", response_model=list[schemas.ProblemaRead])
def listar_problemas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_problemas(db, skip, limit)

@router.get("/{problema_id}", response_model=schemas.ProblemaRead)
def obter_problema(problema_id: int, db: Session = Depends(get_db)):
    prob = crud.get_problema(db, problema_id)
    if not prob:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Problema não encontrado")
    return prob

@router.post("/", response_model=schemas.ProblemaRead, status_code=status.HTTP_201_CREATED)
def criar_problema(problema: schemas.ProblemaCreate, db: Session = Depends(get_db)):
    return crud.create_problema(db, problema)
