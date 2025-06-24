from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/problemas", tags=["Problemas"])

@router.get("/", response_model=list[schemas.Problema])
def listar_problemas(skip: int=0, limit: int=100, db: Session=Depends(get_db)):
    return crud.get_problemas(db, skip, limit)

@router.get("/{problema_id}", response_model=schemas.Problema)
def obter_problema(problema_id: int, db: Session=Depends(get_db)):
    p = crud.get_problema(db, problema_id)
    if not p:
        raise HTTPException(404, "Problema não encontrado")
    return p

@router.post("/", response_model=schemas.Problema, status_code=201)
def criar_problema(p: schemas.ProblemaCreate, db: Session=Depends(get_db)):
    return crud.create_problema(db, p)
