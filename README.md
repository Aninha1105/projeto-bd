# Projeto-BD

## Introdução
Este projeto é um sistema completo para gerenciamento de competições de programação, com backend em Python (FastAPI) e frontend em React. Ele permite o cadastro e autenticação de usuários, gerenciamento de equipes, competições, problemas, inscrições, submissões, estatísticas e patrocínios.

## Requisitos

- **Backend**
  - Python 3.11+
  - PostgreSQL 12+
  - Make (opcional, para facilitar comandos)
- **Frontend**
  - Node.js 18+ e npm (ou yarn)
- **Geral**
  - Git (para clonar o repositório)

## Como Executar

### 1. Backend (API)

1. Acesse a pasta do backend:
   ```sh
   cd backend
   ```
2. Crie o ambiente virtual e instale as dependências:
   ```sh
   make install
   ```
   Ou manualmente:
   ```sh
   python -m venv .venv
   source .venv/bin/activate  # Linux/macOS
   .\.venv\Scripts\activate   # Windows
   pip install -r requirements.txt
   ```
3. Configure a variável de ambiente `DATABASE_URL` com a string de conexão do seu banco.
4. Inicie o servidor:
   ```sh
   make run
   ```
   Ou:
   ```sh
   uvicorn app.main:app --reload
   ```
5. A API estará disponível em `http://localhost:8000`.

### 2. Frontend (Web)

1. Acesse a pasta do frontend:
   ```sh
   cd frontend
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```sh
   npm run dev
   ```
4. Acesse o sistema em `http://localhost:5173`.

## Estrutura do Projeto

- `backend/`: Código do backend (API FastAPI, modelos, rotas, schemas, etc.)
- `frontend/`: Código do frontend (React, componentes, páginas, estilos)
- `script_gerador.sql`: Script SQL para criação do banco de dados
- `README.md`: Documentação do projeto

## Conclusão

Este projeto oferece uma solução para o gerenciamento de maratonas e competições de programação, com interface web moderna e API robusta. Pode ser facilmente expandido para novas funcionalidades e integrações.