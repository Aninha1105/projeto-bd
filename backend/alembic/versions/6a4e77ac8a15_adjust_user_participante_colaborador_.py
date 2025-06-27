"""Adjust user, participante, colaborador, patrocinador

Revision ID: 6a4e77ac8a15
Revises: dd1b95a97c82
Create Date: 2025-06-27 14:33:48.359337

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6a4e77ac8a15'
down_revision: Union[str, Sequence[str], None] = 'dd1b95a97c82'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Usuário: adiciona coluna foto
    op.add_column('usuario', sa.Column('foto', sa.LargeBinary(), nullable=True))
    
    # Participante: renomeia coluna, remove foto
    op.alter_column('participante', 'universidade', new_column_name='instituicao')
    op.drop_column('participante', 'foto')

    # Colaborador: adiciona instituicao
    op.add_column('colaborador', sa.Column('instituicao', sa.String(length=100), nullable=True))

    # Patrocinador: remove coluna logotipo
    op.drop_column('patrocinador', 'logotipo')

def downgrade() -> None:
    """Downgrade schema."""
    # Reverte alterações
    op.add_column('patrocinador', sa.Column('logotipo', sa.LargeBinary(), nullable=True))
    op.drop_column('colaborador', 'instituicao')
    op.add_column('participante', sa.Column('foto', sa.LargeBinary(), nullable=True))
    op.alter_column('participante', 'instituicao', new_column_name='universidade')
    op.drop_column('usuario', 'foto')
