from fastapi import APIRouter, Depends, HTTPException, status, Response, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from .. import crud, schemas, models
from ..database import get_db
from ..security import hash_password
import base64

router = APIRouter(prefix="/inscricoes", tags=["Inscrições"])

@router.get("/", response_model=list[schemas.InscricaoRead])
def listar_inscricoes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_inscricoes(db, skip, limit)

@router.get("/competicao/{comp_id}", response_model=List[schemas.InscricaoRead])
def listar_inscricoes_por_competicao(comp_id: int, db: Session = Depends(get_db)):
    return db.query(models.Inscricao)\
        .filter(models.Inscricao.id_competicao == comp_id)\
        .join(models.Participante)\
        .options(joinedload(models.Inscricao.participante))\
        .all()

@router.get("/{insc_id}", response_model=schemas.InscricaoRead)
def obter_inscricao(insc_id: int, db: Session = Depends(get_db)):
    i = crud.get_inscricao(db, insc_id)
    if not i:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inscrição não encontrada")
    return i

@router.post("/", response_model=schemas.InscricaoRead, status_code=status.HTTP_201_CREATED)
def criar_inscricao(insc: schemas.InscricaoCreate, db: Session = Depends(get_db)):
    return crud.create_inscricao(db, insc)

@router.post("/competicao/{comp_id}", response_model=schemas.InscricaoRead, status_code=status.HTTP_201_CREATED)
async def criar_inscricao_completa(
    comp_id: int,
    name: str = Form(...),
    email: str = Form(...),
    birthDate: str = Form(...),
    university: str = Form(...),
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """Cria uma inscrição completa incluindo usuário e participante"""
    try:
        # Verificar se a competição existe
        competicao = crud.get_competicao(db, comp_id)
        if not competicao:
            raise HTTPException(status_code=404, detail="Competição não encontrada")
        
        # Verificar se o usuário já existe
        existing_user = db.query(models.Usuario).filter(models.Usuario.email == email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Usuário com este email já existe")
        
        # Processar foto se fornecida
        foto_bytes = None
        if photo:
            foto_bytes = await photo.read()
        
        # Criar usuário
        senha_hash = hash_password("senha123")  # Senha padrão, pode ser alterada depois
        usuario_data = schemas.UsuarioCreate(
            nome=name,
            email=email,
            senha_hash=senha_hash,
            tipo="participante",
            foto=foto_bytes
        )
        usuario = crud.create_usuario(db, usuario_data)
        
        # Criar participante
        participante_data = schemas.ParticipanteCreate(
            id_usuario=usuario.id_usuario,
            instituicao=university
        )
        participante = crud.create_participante(db, participante_data)
        
        # Criar inscrição
        inscricao_data = schemas.InscricaoCreate(
            id_usuario=usuario.id_usuario,
            id_competicao=comp_id,
            categoria="individual"
        )
        inscricao = crud.create_inscricao(db, inscricao_data)
        
        return inscricao
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")

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