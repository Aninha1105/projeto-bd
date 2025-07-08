# backend/app/routers/problemas.py
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from .. import crud, schemas, models
from ..database import get_db

router = APIRouter(prefix="/problemas", tags=["Problemas"])

@router.get("/", response_model=list[schemas.ProblemaRead])
def listar_problemas(skip: int = 0, limit: int = 100, comp_id: int = None, db: Session = Depends(get_db)):
    if comp_id is not None:
        return db.query(models.Problema).filter(models.Problema.id_competicao == comp_id).offset(skip).limit(limit).all()
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

@router.put("/{problema_id}", response_model=schemas.ProblemaRead)
def alterar_problema(problema_id: int, prob: schemas.ProblemaCreate, db: Session = Depends(get_db)):
    updated = crud.update_problema(db, problema_id, prob)
    if not updated:
        raise HTTPException(404, "Problema não encontrado")
    return updated

@router.delete("/{problema_id}", status_code=204)
def remover_problema(problema_id: int, db: Session = Depends(get_db)):
    success = crud.delete_problema(db, problema_id)
    if not success:
        raise HTTPException(404, "Problema não encontrado")
    return Response(status_code=204)