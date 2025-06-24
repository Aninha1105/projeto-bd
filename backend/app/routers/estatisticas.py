from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/estatisticas", tags=["Estatisticas"])

@router.get("/", response_model=list[schemas.Estatistica])
def listar_estatisticas(skip: int=0, limit: int=100, db: Session=Depends(get_db)):
    return crud.get_estatisticas(db, skip, limit)