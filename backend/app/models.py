# backend/app/models.py

from sqlalchemy import (
    Column, Integer, String, Date, DECIMAL,
    ForeignKey, Enum, LargeBinary, DateTime, UniqueConstraint,
    Time, Text
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime
import enum

from .database import Base

# Enums
class UsuarioTipo(enum.Enum):
    admin = "admin"
    colaborador = "colaborador"
    participante = "participante"
    patrocinador = "patrocinador"

class ColaboradorPapel(enum.Enum):
    professor = "professor"
    setter = "setter"
    tester = "tester"
    organizador = "organizador"

class ProblemaNivel(enum.Enum):
    fácil = "fácil"
    médio = "médio"
    difícil = "difícil"

class SubmissaoStatus(enum.Enum):
    aceito = "aceito"
    rejeitado = "rejeitado"
    pendente = "pendente"


# 1. Usuário
class Usuario(Base):
    __tablename__ = "usuario"
    id_usuario = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    senha_hash = Column(String(255), nullable=False)
    tipo = Column(Enum(UsuarioTipo), nullable=False)

    # Novo atributo
    foto = Column(LargeBinary, nullable=True)

    colaborador = relationship("Colaborador", uselist=False, back_populates="usuario")
    participante = relationship("Participante", uselist=False, back_populates="usuario")
    patrocinador = relationship("Patrocinador", uselist=False, back_populates="usuario")
  

# 2. Equipe de Colaboradores
class EquipeColaboradores(Base):
    __tablename__ = "equipe_colaboradores"
    id_equipe = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)

    colaboradores = relationship("Colaborador", back_populates="equipe")
    competicoes = relationship("Competicao", back_populates="equipe")


# 3. Colaborador
class Colaborador(Base):
    __tablename__ = "colaborador"
    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario"), primary_key=True)
    papel = Column(Enum(ColaboradorPapel), nullable=False)
    id_equipe = Column(Integer, ForeignKey("equipe_colaboradores.id_equipe"), nullable=True)
    instituicao = Column(String(100), nullable=True)

    usuario = relationship("Usuario", back_populates="colaborador")
    equipe = relationship("EquipeColaboradores", back_populates="colaboradores")

    @hybrid_property
    def num_competicoes(self):
        # Competicoes via equipe
        return len(self.equipe.competicoes) if self.equipe else 0

# 4. Participante
class Participante(Base):
    __tablename__ = "participante"
    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario"), primary_key=True)
    instituicao = Column(String(100))

    usuario = relationship("Usuario", back_populates="participante")
    inscricoes = relationship("Inscricao", back_populates="participante")
    submissoes = relationship("Submissao", back_populates="participante")

    @hybrid_property
    def num_competicoes(self):
        # Competicoes via inscricoes
        return len(self.inscricoes)
    
    @hybrid_property
    def num_submissoes(self):
        return len(self.submissoes)

# 5. Patrocinador
class Patrocinador(Base):
    __tablename__ = "patrocinador"
    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario"), primary_key=True)

    usuario = relationship("Usuario", back_populates="patrocinador")
    competicoes = relationship("CompeticaoPatrocinador", back_populates="patrocinador")

    @hybrid_property
    def num_competicoes(self):
        # Competicoes via competicao_patrocinador
        return len(self.competicoes)

# 6. Competição
class Competicao(Base):
    __tablename__ = "competicao"
    id_competicao = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    local = Column(String(100))
    data = Column(Date, nullable=False)
    id_equipe = Column(Integer, ForeignKey("equipe_colaboradores.id_equipe"), nullable=False)

    # novos atributos
    horario = Column(Time, nullable=True)
    max_participantes = Column(Integer, nullable=True)
    descricao = Column(Text, nullable=True)

    equipe = relationship("EquipeColaboradores", back_populates="competicoes")
    patrocinadores = relationship("CompeticaoPatrocinador", back_populates="competicao")
    inscricoes = relationship("Inscricao", back_populates="competicao")
    problemas = relationship("Problema", back_populates="competicao")
    estatistica = relationship("Estatistica", uselist=False, back_populates="competicao")

    @hybrid_property
    def num_inscritos(self):
        # contador simples em Python
        return len(self.inscricoes)
    
    @hybrid_property
    def status(self):
        hoje = datetime.today().date()
        if self.data > hoje:
            return "Próxima"
        elif self.data == hoje:
            return "Hoje"
        else:
            return "Finalizada"

# 7. CompeticaoPatrocinador
class CompeticaoPatrocinador(Base):
    __tablename__ = "competicao_patrocinador"
    id_link = Column(Integer, primary_key=True, index=True)
    id_competicao = Column(Integer, ForeignKey("competicao.id_competicao"), nullable=False)
    id_usuario_patro = Column(Integer, ForeignKey("patrocinador.id_usuario"), nullable=False)
    contribuicao = Column(DECIMAL(10,2))


    __table_args__ = (
        UniqueConstraint("id_competicao", "id_usuario_patro", name="uix_comp_patro"),
    )

    competicao = relationship("Competicao", back_populates="patrocinadores")
    patrocinador = relationship("Patrocinador", back_populates="competicoes")


# 8. Inscricao
class Inscricao(Base):
    __tablename__ = "inscricao"
    id_inscricao = Column(Integer, primary_key=True, index=True)
    categoria = Column(String(50))
    id_usuario = Column(Integer, ForeignKey("participante.id_usuario"), nullable=False)
    id_competicao = Column(Integer, ForeignKey("competicao.id_competicao"), nullable=False)

    participante = relationship("Participante", back_populates="inscricoes")
    competicao = relationship("Competicao", back_populates="inscricoes")


# 9. Problema
class Problema(Base):
    __tablename__ = "problema"
    id_problema = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(100), nullable=False)
    nivel = Column(Enum(ProblemaNivel), nullable=False)
    link = Column(String(200), nullable=False)
    id_competicao = Column(Integer, ForeignKey("competicao.id_competicao"), nullable=False)

    competicao = relationship("Competicao", back_populates="problemas")
    submissoes = relationship("Submissao", back_populates="problema")


# 10. Submissao
class Submissao(Base):
    __tablename__ = "submissao"
    id_submissao = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, nullable=False)
    status = Column(Enum(SubmissaoStatus), nullable=False)
    id_problema = Column(Integer, ForeignKey("problema.id_problema"), nullable=False)
    id_usuario = Column(Integer, ForeignKey("participante.id_usuario"), nullable=False)

    problema = relationship("Problema", back_populates="submissoes")
    participante = relationship("Participante", back_populates="submissoes")


# 11. Estatistica
class Estatistica(Base):
    __tablename__ = "estatistica"
    id_estatistica = Column(Integer, primary_key=True, index=True)
    media_tempo = Column(DECIMAL(10,2))
    taxa_acerto = Column(DECIMAL(5,2))
    problema_mais_dificil = Column(String(100))
    id_competicao = Column(Integer, ForeignKey("competicao.id_competicao"), unique=True, nullable=False)

    competicao = relationship("Competicao", back_populates="estatistica")
