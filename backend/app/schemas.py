# backend/app/schemas.py
from pydantic import BaseModel
from datetime import date, datetime, time
from typing import Optional

# Schemas para Competição (existente)
class CompeticaoBase(BaseModel):
    nome: str
    local: Optional[str] = None
    data: date
    id_equipe: int

    # novos campos
    horario: Optional[time] = None
    max_participantes: Optional[int] = None
    descricao: Optional[str] = None

class CompeticaoCreate(CompeticaoBase):
    pass

class CompeticaoRead(CompeticaoBase):
    id_competicao: int

    # atributos virtuais
    status: Optional[str]
    num_inscritos: Optional[int]
    class Config:
        from_attributes = True

# Schemas para Usuário
class UsuarioBase(BaseModel):
    nome: str
    email: str
    senha_hash: str
    tipo: str
    foto: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    pass

class UsuarioUpdate(BaseModel):
    nome: Optional[str] = None

class UsuarioRead(UsuarioBase):
    id_usuario: int

    class Config:
        from_attributes = True
        
# Colaborador (herda de Usuario)
class ColaboradorBase(BaseModel):
    id_usuario: int
    papel: Optional[str] = None
    id_equipe: Optional[int] = None
    instituicao: Optional[str] = None

class ColaboradorCreate(ColaboradorBase):
    pass

class ColaboradorRead(ColaboradorBase):
    # atributo virtual
    num_competicoes: int
    nome_equipe: Optional[str]
    # atributos de herança
    usuario: UsuarioUpdate
    class Config:
        from_attributes = True

class ColaboradorUpdate(BaseModel):
    instituicao: Optional[str] = None
    papel: Optional[str] = None

# Participante (herda de Usuario)
class ParticipanteBase(BaseModel):
    id_usuario: int
    instituicao: Optional[str] = None

class ParticipanteCreate(ParticipanteBase):
    pass

class ParticipanteRead(ParticipanteBase):
    # atributos virtuais
    num_submissoes: int
    num_competicoes: int
    # atributos de herança
    usuario: UsuarioUpdate
    class Config:
        from_attributes = True

class ParticipanteUpdate(BaseModel):
    instituicao: Optional[str] = None

# Patrocinador (herda de Usuario)
class PatrocinadorBase(BaseModel):
    id_usuario: int

class PatrocinadorCreate(PatrocinadorBase):
    pass

class PatrocinadorRead(PatrocinadorBase):
    # atributo virtual
    num_competicoes: int
    total_contribuicao: float
    # atributos de herança
    usuario: UsuarioUpdate  # <-- troque de UsuarioUpdate para UsuarioRead
    class Config:
        from_attributes = True

# Schemas para Equipe
class EquipeBase(BaseModel):
    nome: str

class EquipeCreate(EquipeBase):
    pass

class EquipeRead(EquipeBase):
    id_equipe: int

    class Config:
        from_attributes = True

# Schemas para Inscricao
class InscricaoBase(BaseModel):
    categoria: Optional[str] = None
    id_usuario: int
    id_competicao: int

class InscricaoCreate(InscricaoBase):
    pass

class InscricaoRead(InscricaoBase):
    id_inscricao: int
    participante: ParticipanteRead
    class Config:
        from_attributes = True

# Schemas para Problema
class ProblemaBase(BaseModel):
    titulo: str
    nivel: str
    link: str
    id_competicao: int

class ProblemaCreate(ProblemaBase):
    pass

class ProblemaRead(ProblemaBase):
    id_problema: int

    class Config:
        from_attributes = True

# Schemas para Submissao
class SubmissaoBase(BaseModel):
    timestamp: datetime
    status: str
    id_problema: int
    id_usuario: int

class SubmissaoCreate(SubmissaoBase):
    pass

class SubmissaoRead(SubmissaoBase):
    id_submissao: int

    class Config:
        from_attributes = True

# Schemas para Estatistica
class EstatisticaBase(BaseModel):
    media_tempo: float
    taxa_acerto: float
    problema_mais_dificil: Optional[str] = None
    id_competicao: int

class EstatisticaRead(EstatisticaBase):
    id_estatistica: int

    class Config:
        from_attributes = True

class CompeticaoPatrocinadorBase(BaseModel):
    id_competicao: int
    id_usuario_patro: int
    contribuicao: float

class CompeticaoPatrocinadorCreate(CompeticaoPatrocinadorBase):
    pass

class CompeticaoPatrocinadorRead(CompeticaoPatrocinadorBase):
    id_link: int
    patrocinador: PatrocinadorRead
    class Config:
        from_attributes = True
        
# Schema de entrada de login
class LoginRequest(BaseModel):
    email: str
    password: str

# Schema de resposta de usuário (sem senha)
class UserResponse(BaseModel):
    id_usuario: int
    email: str
    tipo: str

    class Config:
        from_attributes = True
