from sqlalchemy.orm import Session
from . import models, schemas

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
        id_equipe=comp.id_equipe
    )
    db.add(db_comp)
    db.commit()
    db.refresh(db_comp)
    return db_comp

# Usuários
def get_usuarios(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Usuario).offset(skip).limit(limit).all()

def get_usuario(db: Session, user_id: int):
    return db.query(models.Usuario).filter(models.Usuario.id_usuario == user_id).first()

def create_usuario(db: Session, usuario: schemas.UsuarioCreate):
    db_user = models.Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha_hash=usuario.senha_hash,
        tipo=usuario.tipo
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Equipes
def get_equipes(db: Session, skip=0, limit=100):
    return db.query(models.EquipeColaboradores).offset(skip).limit(limit).all()

def get_equipe(db: Session, equipe_id: int):
    return db.query(models.EquipeColaboradores).filter(models.EquipeColaboradores.id_equipe==equipe_id).first()

def create_equipe(db: Session, e: schemas.EquipeCreate):
    db_e = models.EquipeColaboradores(nome=e.nome)
    db.add(db_e); db.commit(); db.refresh(db_e)
    return db_e

# Inscrições
def get_inscricoes(db: Session, skip=0, limit=100):
    return db.query(models.Inscricao).offset(skip).limit(limit).all()

def get_inscricao(db: Session, inscricao_id: int):
    return db.query(models.Inscricao).filter(models.Inscricao.id_inscricao==inscricao_id).first()

def create_inscricao(db: Session, i: schemas.InscricaoCreate):
    db_i = models.Inscricao(**i.dict())
    db.add(db_i); db.commit(); db.refresh(db_i)
    return db_i

# Problemas
def get_problemas(db: Session, skip=0, limit=100):
    return db.query(models.Problema).offset(skip).limit(limit).all()

def get_problema(db: Session, problema_id: int):
    return db.query(models.Problema).filter(models.Problema.id_problema==problema_id).first()

def create_problema(db: Session, p: schemas.ProblemaCreate):
    db_p = models.Problema(**p.dict())
    db.add(db_p); db.commit(); db.refresh(db_p)
    return db_p

# Submissões
def get_submissoes(db: Session, skip=0, limit=100):
    return db.query(models.Submissao).offset(skip).limit(limit).all()

def get_submissao(db: Session, submissao_id: int):
    return db.query(models.Submissao).filter(models.Submissao.id_submissao==submissao_id).first()

def create_submissao(db: Session, s: schemas.SubmissaoCreate):
    db_s = models.Submissao(**s.dict())
    db.add(db_s); db.commit(); db.refresh(db_s)
    return db_s

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
        id_equipe=c.id_equipe
    )
    db.add(db_c); db.commit(); db.refresh(db_c)
    return db_c

# Participantes
def get_participantes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Participante).offset(skip).limit(limit).all()

def get_participante(db: Session, user_id: int):
    return db.query(models.Participante).filter(models.Participante.id_usuario == user_id).first()

def create_participante(db: Session, p: schemas.ParticipanteCreate):
    db_p = models.Participante(
        id_usuario=p.id_usuario,
        universidade=p.universidade,
        foto=None
    )
    db.add(db_p); db.commit(); db.refresh(db_p)
    return db_p

# Patrocinadores
def get_patrocinadores(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Patrocinador).offset(skip).limit(limit).all()

def get_patrocinador(db: Session, user_id: int):
    return db.query(models.Patrocinador).filter(models.Patrocinador.id_usuario == user_id).first()

def create_patrocinador(db: Session, p: schemas.PatrocinadorCreate):
    db_p = models.Patrocinador(
        id_usuario=p.id_usuario,
        contribuicao=p.contribuicao,
        logotipo=None
    )
    db.add(db_p); db.commit(); db.refresh(db_p)
    return db_p
