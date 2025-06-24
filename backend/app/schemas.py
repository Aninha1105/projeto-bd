from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class CompeticaoBase(BaseModel):
    nome: str
    local: str | None = None
    data: date
    id_equipe: int

class CompeticaoCreate(CompeticaoBase):
    pass

class Competicao(CompeticaoBase):
    id_competicao: int

    class Config:
        from_attributes = True

# 1) Usuário
class UsuarioBase(BaseModel):
    nome: str
    email: str
    tipo: str  # poderia usar enum

class UsuarioCreate(UsuarioBase):
    senha_hash: str

class Usuario(UsuarioBase):
    id_usuario: int
    class Config:
        from_attributes = True

# 2) Equipe
class EquipeBase(BaseModel):
    nome: str

class EquipeCreate(EquipeBase):
    pass

class Equipe(EquipeBase):
    id_equipe: int
    class Config:
        from_attributes = True

# 3) Inscrição
class InscricaoBase(BaseModel):
    categoria: Optional[str]
    id_usuario: int
    id_competicao: int

class InscricaoCreate(InscricaoBase):
    pass

class Inscricao(InscricaoBase):
    id_inscricao: int
    class Config:
        from_attributes = True

# 4) Problema
class ProblemaBase(BaseModel):
    titulo: str
    nivel: str
    link: str
    id_competicao: int

class ProblemaCreate(ProblemaBase):
    pass

class Problema(ProblemaBase):
    id_problema: int
    class Config:
        from_attributes = True

# 5) Submissão
class SubmissaoBase(BaseModel):
    timestamp: datetime
    status: str
    id_problema: int
    id_usuario: int

class SubmissaoCreate(SubmissaoBase):
    pass

class Submissao(SubmissaoBase):
    id_submissao: int
    class Config:
        from_attributes = True

# 6) Estatística
class EstatisticaBase(BaseModel):
    media_tempo: float
    taxa_acerto: float
    problema_mais_dificil: Optional[str]
    id_competicao: int

class Estatistica(EstatisticaBase):
    id_estatistica: int
    class Config:
        from_attributes = True


