# backend/app/routers/usuarios.py
from fastapi import APIRouter, Depends, HTTPException, status, Response, UploadFile, File, Request
from fastapi import Body
from sqlalchemy.orm import Session
from .. import crud, schemas, models
from ..database import get_db

router = APIRouter(prefix="/usuarios", tags=["Usuários"])

@router.get("/", response_model=list[schemas.UsuarioRead])
def listar_usuarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_usuarios(db, skip, limit)

@router.get("/{user_id}", response_model=schemas.UsuarioRead)
def obter_usuario(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_usuario_com_foto_base64(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

@router.post("/", response_model=schemas.UsuarioRead, status_code=status.HTTP_201_CREATED)
def criar_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    return crud.create_usuario(db, usuario)

@router.put("/{usuario_id}")
def alterar_usuario(usuario_id: int, usuario: schemas.UsuarioUpdate, db: Session = Depends(get_db)):
    db_usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == usuario_id).first()
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    db_usuario.nome = usuario.nome
    db.commit()
    db.refresh(db_usuario)
    # Retorne o usuário com foto em base64
    return crud.get_usuario_com_foto_base64(db, usuario_id)

@router.delete("/{user_id}", status_code=204)
def remover_usuario(user_id: int, db: Session = Depends(get_db)):
    success = crud.delete_usuario(db, user_id)
    if not success:
        raise HTTPException(404, "Usuário não encontrado")
    return Response(status_code=204)

@router.post("/{user_id}/foto", response_model=schemas.UsuarioRead)
async def upload_user_photo(
    user_id: int,
    foto: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Valida extensão
    if not foto.content_type in ["image/jpeg", "image/png"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Apenas imagens JPEG ou PNG são permitidas."
        )

    # Lê os bytes da imagem
    foto_bytes = await foto.read()

    # Atualiza no banco
    user = crud.update_usuario_foto(db, user_id, foto_bytes)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado."
        )

    # Retorna o usuário com a imagem convertida em base64
    return crud.get_usuario_com_foto_base64(db, user_id)