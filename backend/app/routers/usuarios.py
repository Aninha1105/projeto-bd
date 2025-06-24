from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.get("/", response_model=list[schemas.Usuario])
def listar_usuarios(skip: int=0, limit: int=100, db: Session=Depends(get_db)):
    return crud.get_usuarios(db, skip, limit)

@router.get("/{user_id}", response_model=schemas.Usuario)
def obter_usuario(user_id: int, db: Session=Depends(get_db)):
    u = crud.get_usuario(db, user_id)
    if not u:
        raise HTTPException(404, "Usuário não encontrado")
    return u

@router.post("/", response_model=schemas.Usuario, status_code=201)
def criar_usuario(u: schemas.UsuarioCreate, db: Session=Depends(get_db)):
    return crud.create_usuario(db, u)
