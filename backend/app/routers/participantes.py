from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/participantes", tags=["Participantes"])

@router.get("/", response_model=list[schemas.ParticipanteRead])
def listar_participantes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_participantes(db, skip, limit)

@router.get("/{user_id}", response_model=schemas.ParticipanteRead)
def obter_participante(user_id: int, db: Session = Depends(get_db)):
    p = crud.get_participante(db, user_id)
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Participante não encontrado")
    return p

@router.post("/", response_model=schemas.ParticipanteRead, status_code=status.HTTP_201_CREATED)
def criar_participante(p: schemas.ParticipanteCreate, db: Session = Depends(get_db)):
    return crud.create_participante(db, p)
