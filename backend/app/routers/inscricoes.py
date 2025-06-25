from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/inscricoes", tags=["Inscrições"])

@router.get("/", response_model=list[schemas.InscricaoRead])
def listar_inscricoes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_inscricoes(db, skip, limit)

@router.get("/{insc_id}", response_model=schemas.InscricaoRead)
def obter_inscricao(insc_id: int, db: Session = Depends(get_db)):
    i = crud.get_inscricao(db, insc_id)
    if not i:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inscrição não encontrada")
    return i

@router.post("/", response_model=schemas.InscricaoRead, status_code=status.HTTP_201_CREATED)
def criar_inscricao(insc: schemas.InscricaoCreate, db: Session = Depends(get_db)):
    return crud.create_inscricao(db, insc)

@router.put("/{insc_id}", response_model=schemas.InscricaoRead)
def alterar_inscricao(insc_id: int, i: schemas.InscricaoCreate, db: Session = Depends(get_db)):
    updated = crud.update_inscricao(db, insc_id, i)
    if not updated:
        raise HTTPException(404, "Inscrição não encontrada")
    return updated

@router.delete("/{insc_id}", status_code=204)
def remover_inscricao(insc_id: int, db: Session = Depends(get_db)):
    success = crud.delete_inscricao(db, insc_id)
    if not success:
        raise HTTPException(404, "Inscrição não encontrada")
    return Response(status_code=204)