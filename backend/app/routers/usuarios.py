# backend/app/routers/usuarios.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/usuarios", tags=["Usuários"])

@router.get("/", response_model=list[schemas.UsuarioRead])
def listar_usuarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_usuarios(db, skip, limit)

@router.get("/{user_id}", response_model=schemas.UsuarioRead)
def obter_usuario(user_id: int, db: Session = Depends(get_db)):
    u = crud.get_usuario(db, user_id)
    if not u:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Usuário não encontrado")
    return u

@router.post("/", response_model=schemas.UsuarioRead, status_code=status.HTTP_201_CREATED)
def criar_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    return crud.create_usuario(db, usuario)
