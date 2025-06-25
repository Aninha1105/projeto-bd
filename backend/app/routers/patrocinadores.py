from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/patrocinadores", tags=["Patrocinadores"])

@router.get("/", response_model=list[schemas.PatrocinadorRead])
def listar_patrocinadores(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_patrocinadores(db, skip, limit)

@router.get("/{user_id}", response_model=schemas.PatrocinadorRead)
def obter_patrocinador(user_id: int, db: Session = Depends(get_db)):
    p = crud.get_patrocinador(db, user_id)
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patrocinador não encontrado")
    return p

@router.post("/", response_model=schemas.PatrocinadorRead, status_code=status.HTTP_201_CREATED)
def criar_patrocinador(p: schemas.PatrocinadorCreate, db: Session = Depends(get_db)):
    return crud.create_patrocinador(db, p)

@router.put("/{user_id}", response_model=schemas.PatrocinadorRead)
def alterar_patrocinador(user_id: int, p: schemas.PatrocinadorCreate, db: Session = Depends(get_db)):
    updated = crud.update_patrocinador(db, user_id, p)
    if not updated:
        raise HTTPException(404, "Patrocinador não encontrado")
    return updated

@router.delete("/{user_id}", status_code=204)
def remover_patrocinador(user_id: int, db: Session = Depends(get_db)):
    success = crud.delete_patrocinador(db, user_id)
    if not success:
        raise HTTPException(404, "Patrocinador não encontrado")
    return Response(status_code=204)
