from typing import Optional
from sqlalchemy.orm import Session
from . import models, schemas
from .security import hash_password
import base64

# Competições
def get_competicoes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Competicao).offset(skip).limit(limit).all()

def get_competicao(db: Session, comp_id: int):
    return db.query(models.Competicao).filter(models.Competicao.id_competicao == comp_id).first()

def create_competicao(db: Session, comp: schemas.CompeticaoCreate):
    db_comp = models.Competicao(
        nome=comp.nome,
        local=comp.local,
        data=comp.data,
        id_equipe=comp.id_equipe,
        horario=comp.horario,
        max_participantes=comp.max_participantes,
        descricao=comp.descricao
    )
    db.add(db_comp)
    db.commit()
    db.refresh(db_comp)
    return db_comp

def update_competicao(db: Session, comp_id: int, comp_in: schemas.CompeticaoCreate):
    db_comp = get_competicao(db, comp_id)
    if not db_comp:
        return None
    for field, value in comp_in.dict(exclude_unset=True).items():
        setattr(db_comp, field, value)
    db.commit()
    db.refresh(db_comp)
    return db_comp

def delete_competicao(db: Session, comp_id: int):
    db_comp = get_competicao(db, comp_id)
    if not db_comp:
        return False
    db.delete(db_comp)
    db.commit()
    return True


# Usuários
def get_usuarios(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Usuario).offset(skip).limit(limit).all()

def get_usuario(db: Session, user_id: int):
    return db.query(models.Usuario).filter(models.Usuario.id_usuario == user_id).first()

def create_usuario(db: Session, usuario: schemas.UsuarioCreate):
    hashed = hash_password(usuario.senha_hash)
    db_user = models.Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha_hash=hashed,
        tipo=usuario.tipo,
        foto=usuario.foto
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_usuario(db: Session, user_id: int, u_in: schemas.UsuarioUpdate):
    db_user = db.query(models.Usuario).get(user_id)
    if not db_user:
        return None
    
    data = u_in.dict(exclude_unset=True)
    # Se alterar senha, gerar hash
    if 'senha' in data:
        data['senha_hash'] = hash_password(data.pop('senha'))

    for field, value in data.items():
        setattr(db_user, field, value)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_usuario(db: Session, user_id: int):
    db_user = get_usuario(db, user_id)
    if not db_user:
        return False
    db.delete(db_user); db.commit()
    return True

def update_usuario_foto(db: Session, user_id: int, foto_bytes: bytes):
    # Busca o usuário
    db_user = db.query(models.Usuario).filter(models.Usuario.id_usuario == user_id).first()
    if not db_user:
        return None

    # Atualiza o campo de foto (supondo que seja Column(LargeBinary))
    db_user.foto = foto_bytes
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_usuario_com_foto_base64(db: Session, user_id: int) -> Optional[models.Usuario]:
    user = db.query(models.Usuario).filter(models.Usuario.id_usuario == user_id).first()
    if not user:
        return None

    if user.foto:
        user.foto = base64.b64encode(user.foto).decode("utf-8")

    return user

# Equipes
def get_equipes(db: Session, skip=0, limit=100):
    return db.query(models.EquipeColaboradores).offset(skip).limit(limit).all()

def get_equipe(db: Session, equipe_id: int):
    return db.query(models.EquipeColaboradores).filter(models.EquipeColaboradores.id_equipe==equipe_id).first()

def create_equipe(db: Session, e: schemas.EquipeCreate):
    db_e = models.EquipeColaboradores(nome=e.nome)
    db.add(db_e); db.commit(); db.refresh(db_e)
    return db_e

def update_equipe(db: Session, eq_id: int, e_in: schemas.EquipeCreate):
    db_e = get_equipe(db, eq_id)
    if not db_e:
        return None
    db_e.nome = e_in.nome
    db.commit(); db.refresh(db_e)
    return db_e


def delete_equipe(db: Session, eq_id: int):
    db_e = get_equipe(db, eq_id)
    if not db_e:
        return False
    db.delete(db_e); db.commit()
    return True

# Inscrições
def get_inscricoes(db: Session, skip=0, limit=100):
    return db.query(models.Inscricao).offset(skip).limit(limit).all()

def get_inscricao(db: Session, inscricao_id: int):
    return db.query(models.Inscricao).filter(models.Inscricao.id_inscricao==inscricao_id).first()

def create_inscricao(db: Session, i: schemas.InscricaoCreate):
    db_i = models.Inscricao(**i.dict())
    db.add(db_i); db.commit(); db.refresh(db_i)
    return db_i

def update_inscricao(db: Session, insc_id: int, i_in: schemas.InscricaoCreate):
    db_i = get_inscricao(db, insc_id)
    if not db_i:
        return None
    for field, value in i_in.dict(exclude_unset=True).items():
        setattr(db_i, field, value)
    db.commit(); db.refresh(db_i)
    return db_i


def delete_inscricao(db: Session, insc_id: int):
    db_i = get_inscricao(db, insc_id)
    if not db_i:
        return False
    db.delete(db_i); db.commit()
    return True

def get_inscricoes_por_competicao(db: Session, comp_id: int):
    return db.query(models.Inscricao).filter(models.Inscricao.id_competicao == comp_id).all()

# Problemas
def get_problemas(db: Session, skip=0, limit=100):
    return db.query(models.Problema).offset(skip).limit(limit).all()

def get_problema(db: Session, problema_id: int):
    return db.query(models.Problema).filter(models.Problema.id_problema==problema_id).first()

def create_problema(db: Session, p: schemas.ProblemaCreate):
    db_p = models.Problema(**p.dict())
    db.add(db_p); db.commit(); db.refresh(db_p)
    return db_p

def update_problema(db: Session, prob_id: int, p_in: schemas.ProblemaCreate):
    db_p = get_problema(db, prob_id)
    if not db_p:
        return None
    for field, value in p_in.dict(exclude_unset=True).items():
        setattr(db_p, field, value)
    db.commit(); db.refresh(db_p)
    return db_p


def delete_problema(db: Session, prob_id: int):
    db_p = get_problema(db, prob_id)
    if not db_p:
        return False
    db.delete(db_p); db.commit()
    return True

# Submissões
def get_submissoes(db: Session, skip=0, limit=100):
    return db.query(models.Submissao).offset(skip).limit(limit).all()

def get_submissao(db: Session, submissao_id: int):
    return db.query(models.Submissao).filter(models.Submissao.id_submissao==submissao_id).first()

def create_submissao(db: Session, s: schemas.SubmissaoCreate):
    db_s = models.Submissao(**s.dict())
    db.add(db_s); db.commit(); db.refresh(db_s)
    return db_s

def update_submissao(db: Session, sub_id: int, s_in: schemas.SubmissaoCreate):
    db_s = get_submissao(db, sub_id)
    if not db_s:
        return None
    for field, value in s_in.dict(exclude_unset=True).items():
        setattr(db_s, field, value)
    db.commit(); db.refresh(db_s)
    return db_s


def delete_submissao(db: Session, sub_id: int):
    db_s = get_submissao(db, sub_id)
    if not db_s:
        return False
    db.delete(db_s); db.commit()
    return True

# Estatísticas (list + opcional call da procedure)
def get_estatisticas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Estatistica).offset(skip).limit(limit).all()

def get_estatistica(db: Session, estat_id: int):
    return db.query(models.Estatistica).filter(models.Estatistica.id_estatistica == estat_id).first()

# Colaboradores
def get_colaboradores(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Colaborador).offset(skip).limit(limit).all()

def get_colaborador(db: Session, user_id: int):
    return db.query(models.Colaborador).filter(models.Colaborador.id_usuario == user_id).first()

def create_colaborador(db: Session, c: schemas.ColaboradorCreate):
    db_c = models.Colaborador(
        id_usuario=c.id_usuario,
        papel=c.papel,
        id_equipe=c.id_equipe or None,
        instituicao=getattr(c, "instituicao", None)
    )
    db.add(db_c); db.commit(); db.refresh(db_c)
    return db_c

def update_colaborador(db: Session, user_id: int, c_in: schemas.ColaboradorCreate):
    db_c = get_colaborador(db, user_id)
    if not db_c:
        return None
    for field, value in c_in.dict(exclude_unset=True).items():
        setattr(db_c, field, value)
    db.commit(); db.refresh(db_c)
    return db_c


def delete_colaborador(db: Session, user_id: int):
    db_c = get_colaborador(db, user_id)
    if not db_c:
        return False
    db.delete(db_c); db.commit()
    return True

# Participantes
def get_participantes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Participante).offset(skip).limit(limit).all()

def get_participante(db: Session, user_id: int):
    return db.query(models.Participante).filter(models.Participante.id_usuario == user_id).first()

def create_participante(db: Session, p: schemas.ParticipanteCreate):
    db_p = models.Participante(
        id_usuario=p.id_usuario,
        instituicao=p.instituicao,  
    )
    db.add(db_p); db.commit(); db.refresh(db_p)
    return db_p

def update_participante(db: Session, user_id: int, p_in: schemas.ParticipanteCreate):
    db_p = get_participante(db, user_id)
    if not db_p:
        return None
    for field, value in p_in.dict(exclude_unset=True).items():
        setattr(db_p, field, value)
    db.commit(); db.refresh(db_p)
    return db_p


def delete_participante(db: Session, user_id: int):
    db_p = get_participante(db, user_id)
    if not db_p:
        return False
    db.delete(db_p); db.commit()
    return True

# Patrocinadores
def get_patrocinadores(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Patrocinador).offset(skip).limit(limit).all()

def get_patrocinador(db: Session, user_id: int):
    return db.query(models.Patrocinador).filter(models.Patrocinador.id_usuario == user_id).first()

def create_patrocinador(db: Session, p: schemas.PatrocinadorCreate):
    db_p = models.Patrocinador(
        id_usuario=p.id_usuario,
    )
    db.add(db_p); db.commit(); db.refresh(db_p)
    return db_p

def update_patrocinador(db: Session, user_id: int, p_in: schemas.PatrocinadorCreate):
    db_p = get_patrocinador(db, user_id)
    if not db_p:
        return None
    for field, value in p_in.dict(exclude_unset=True).items():
        setattr(db_p, field, value)
    db.commit(); db.refresh(db_p)
    return db_p

def delete_patrocinador(db: Session, user_id: int):
    db_p = get_patrocinador(db, user_id)
    if not db_p:
        return False
    db.delete(db_p); db.commit()
    return True

# Competicao Patrocinador
def get_competicao_patrocinador(db: Session, user_id: int, comp_id: int):
    return db.query(models.CompeticaoPatrocinador).filter(models.CompeticaoPatrocinador.id_usuario_patro == user_id 
                                                          and models.CompeticaoPatrocinador.id_competicao == comp_id).first()

def create_competicao_patrocinador(db: Session, comp_id: int, user_id: int, contribuicao: float):
    link = models.CompeticaoPatrocinador(
        id_competicao=comp_id,
        id_usuario_patro=user_id,
        contribuicao=contribuicao
    )
    db.add(link)
    db.commit()
    db.refresh(link)
    return link

def update_competicao_patrocinador(db: Session, user_id: int, comp_id: int, cp_in: schemas.CompeticaoPatrocinadorCreate):
    db_p = get_competicao_patrocinador(db, user_id, comp_id)
    if not db_p:
        return None
    for field, value in cp_in.dict(exclude_unset=True).items():
        setattr(db_p, field, value)
    db.commit(); db.refresh(db_p)
    return db_p

def delete_competicao_patrocinador(db: Session, user_id: int, comp_id: int):
    db_p = get_competicao_patrocinador(db, user_id,comp_id)
    if not db_p:
        return False
    db.delete(db_p); db.commit()
    return True

def get_patrocinios_por_competicao(db: Session, comp_id: int):
    return db.query(models.CompeticaoPatrocinador).filter(models.CompeticaoPatrocinador.id_competicao == comp_id).all()