"""Add horario, max_participantes, descricao to competicao

Revision ID: dd1b95a97c82
Revises: cdc4c8dbada8
Create Date: 2025-06-27 13:55:54.352412

"""

from alembic import op
import sqlalchemy as sa

# revisão anterior
revision = 'dd1b95a97c82'
down_revision = 'cdc4c8dbada8'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Upgrade schema."""
    # Adiciona as novas colunas em competicao
    op.add_column('competicao',
        sa.Column('horario', sa.Time(), nullable=True)
    )
    op.add_column('competicao',
        sa.Column('max_participantes', sa.Integer(), nullable=True)
    )
    op.add_column('competicao',
        sa.Column('descricao', sa.Text(), nullable=True)
    )

def downgrade() -> None:
    """Downgrade schema."""
    # Reverte as colunas adicionadas
    op.drop_column('competicao', 'descricao')
    op.drop_column('competicao', 'max_participantes')
    op.drop_column('competicao', 'horario')