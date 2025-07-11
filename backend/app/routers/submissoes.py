# backend/app/routers/submissoes.py
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/submissoes", tags=["Submissões"])

@router.get("/", response_model=list[schemas.SubmissaoRead])
def listar_submissoes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_submissoes(db, skip, limit)

@router.get("/{sub_id}", response_model=schemas.SubmissaoRead)
def obter_submissao(sub_id: int, db: Session = Depends(get_db)):
    sub = crud.get_submissao(db, sub_id)
    if not sub:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Submissão não encontrada")
    return sub

@router.post("/", response_model=schemas.SubmissaoRead, status_code=status.HTTP_201_CREATED)
def criar_submissao(submissao: schemas.SubmissaoCreate, db: Session = Depends(get_db)):
    return crud.create_submissao(db, submissao)

@router.put("/{sub_id}", response_model=schemas.SubmissaoRead)
def alterar_submissao(sub_id: int, sub: schemas.SubmissaoCreate, db: Session = Depends(get_db)):
    updated = crud.update_submissao(db, sub_id, sub)
    if not updated:
        raise HTTPException(404, "Submissão não encontrada")
    return updated

@router.delete("/{sub_id}", status_code=204)
def remover_submissao(sub_id: int, db: Session = Depends(get_db)):
    success = crud.delete_submissao(db, sub_id)
    if not success:
        raise HTTPException(404, "Submissão não encontrada")
    return Response(status_code=204)