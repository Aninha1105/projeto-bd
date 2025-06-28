from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session, joinedload
from typing import List
from .. import crud, schemas, models
from ..database import get_db

router = APIRouter(prefix="/competicaopatrocinador", tags=["CompeticaoPatrocinador"])

@router.get("/", response_model=List[schemas.CompeticaoPatrocinadorRead])
def listar_patrocinios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Lista todos os patrocinadores vinculados a competições
    return db.query(models.CompeticaoPatrocinador).offset(skip).limit(limit).all()

@router.get("/competicao/{comp_id}", response_model=List[schemas.CompeticaoPatrocinadorRead])
def listar_patrocinios_por_competicao(comp_id: int, db: Session = Depends(get_db)):
    return db.query(models.CompeticaoPatrocinador)\
        .filter(models.CompeticaoPatrocinador.id_competicao == comp_id)\
        .join(models.Patrocinador)\
        .options(joinedload(models.CompeticaoPatrocinador.patrocinador))\
        .all()

@router.get("/{comp_id}/{user_id}", response_model=schemas.CompeticaoPatrocinadorRead)
def obter_patrocinio(comp_id: int, user_id: int, db: Session = Depends(get_db)):
    # Obtém vínculo específico de patrocinador e competição
    cp = crud.get_competicao_patrocinador(db, user_id, comp_id)
    if not cp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Patrocínio não encontrado")
    return cp

@router.post("/", response_model=schemas.CompeticaoPatrocinadorRead, status_code=status.HTTP_201_CREATED)
def criar_patrocinio(cp_in: schemas.CompeticaoPatrocinadorCreate, db: Session = Depends(get_db)):
    # Cria novo vínculo de patrocínio
    return crud.create_competicao_patrocinador(
        db,
        comp_id=cp_in.id_competicao,
        user_id=cp_in.id_usuario_patro,
        contribuicao=cp_in.contribuicao
    )

@router.put("/{comp_id}/{user_id}", response_model=schemas.CompeticaoPatrocinadorRead)
def atualizar_patrocinio(comp_id: int, user_id: int, cp_in: schemas.CompeticaoPatrocinadorCreate,
                         db: Session = Depends(get_db)):
    # Atualiza contribuição de patrocínio existente
    updated = crud.update_competicao_patrocinador(db, user_id, comp_id, cp_in)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Patrocínio não encontrado")
    return updated

@router.delete("/{comp_id}/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover_patrocinio(comp_id: int, user_id: int, db: Session = Depends(get_db)):
    # Remove vínculo de patrocínio
    success = crud.delete_competicao_patrocinador(db, user_id, comp_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Patrocínio não encontrado")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
