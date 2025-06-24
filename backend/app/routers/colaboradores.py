from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/colaboradores", tags=["Colaboradores"])

@router.get("/", response_model=list[schemas.ColaboradorRead])
def listar_colaboradores(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_colaboradores(db, skip, limit)

@router.get("/{user_id}", response_model=schemas.ColaboradorRead)
def obter_colaborador(user_id: int, db: Session = Depends(get_db)):
    c = crud.get_colaborador(db, user_id)
    if not c:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Colaborador não encontrado")
    return c

@router.post("/", response_model=schemas.ColaboradorRead, status_code=status.HTTP_201_CREATED)
def criar_colaborador(c: schemas.ColaboradorCreate, db: Session = Depends(get_db)):
    return crud.create_colaborador(db, c)
