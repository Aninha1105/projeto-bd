"""Move contrib to junction table

Revision ID: cdc4c8dbada8
Revises: 3651d658c63d
Create Date: 2025-06-25 17:06:20.459023

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cdc4c8dbada8'
down_revision: Union[str, Sequence[str], None] = '3651d658c63d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # 1) Remover a coluna 'contribuicao' de 'patrocinador'
    op.drop_column('patrocinador', 'contribuicao')

    # 2) Adicionar a coluna 'contribuicao' na tabela de relacionamento
    op.add_column('competicao_patrocinador',
        sa.Column('contribuicao', sa.Numeric(10,2), nullable=False, server_default='0.00')
    )
    # Remover default se quiser somente na criação
    op.alter_column('competicao_patrocinador', 'contribuicao', server_default=None)


def downgrade():
    # Para revert
    op.drop_column('competicao_patrocinador', 'contribuicao')
    op.add_column('patrocinador', sa.Column('contribuicao', sa.Numeric(10,2), nullable=False, server_default='0.00'))
