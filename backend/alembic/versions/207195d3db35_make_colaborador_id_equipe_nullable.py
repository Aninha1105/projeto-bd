"""make colaborador.id_equipe nullable

Revision ID: 207195d3db35
Revises: 6a4e77ac8a15
Create Date: 2025-07-01 10:36:26.413844

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '207195d3db35'
down_revision: Union[str, Sequence[str], None] = '6a4e77ac8a15'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Batch alter table cuida de constraints existentes
    with op.batch_alter_table('colaborador') as batch_op:
        batch_op.alter_column(
            'id_equipe',
            existing_type=sa.Integer(),
            nullable=True,
        )

    op.create_unique_constraint('uix_inscricao_usuario_competicao', 'inscricao', ['id_usuario', 'id_competicao'])

def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('colaborador') as batch_op:
        batch_op.alter_column(
            'id_equipe',
            existing_type=sa.Integer(),
            nullable=False,
        )

    op.drop_constraint('uix_inscricao_usuario_competicao', 'inscricao', type_='unique')
