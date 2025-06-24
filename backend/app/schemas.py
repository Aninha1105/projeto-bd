# backend/app/schemas.py
from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, List

# Schemas para Competição (existente)
class CompeticaoBase(BaseModel):
    nome: str
    local: Optional[str] = None
    data: date
    id_equipe: int

class CompeticaoCreate(CompeticaoBase):
    pass

class CompeticaoRead(CompeticaoBase):
    id_competicao: int

    class Config:
        from_attributes = True

# Schemas para Usuário
class UsuarioBase(BaseModel):
    nome: str
    email: str
    tipo: str

class UsuarioCreate(UsuarioBase):
    senha_hash: str

class UsuarioRead(UsuarioBase):
    id_usuario: int

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

# Colaborador (herda de Usuario)
class ColaboradorBase(BaseModel):
    id_usuario: int
    papel: str
    id_equipe: int

class ColaboradorCreate(ColaboradorBase):
    pass

class ColaboradorRead(ColaboradorBase):
    class Config:
        from_attributes = True

# Participante (herda de Usuario)
class ParticipanteBase(BaseModel):
    id_usuario: int
    universidade: Optional[str] = None
    # omitimos foto (binary) no schema de leitura para simplificar

class ParticipanteCreate(ParticipanteBase):
    pass

class ParticipanteRead(ParticipanteBase):
    class Config:
        from_attributes = True

# Patrocinador (herda de Usuario)
class PatrocinadorBase(BaseModel):
    id_usuario: int
    contribuicao: float

class PatrocinadorCreate(PatrocinadorBase):
    pass

class PatrocinadorRead(PatrocinadorBase):
    class Config:
        from_attributes = True
