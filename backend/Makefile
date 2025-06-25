# Makefile para orquestrar tarefas do backend (Windows/Linux/macOS)
# Pré-requisitos: Python 3.11+ e DATABASE_URL

# Variáveis configuráveis
VENV := .venv

# Detecção do SO
ifeq ($(OS),Windows_NT)
    DETECTED_OS := Windows
    ACTIVATE_CMD = .\.venv\Scripts\activate
    PYTHON_PATH := .\.venv\Scripts\python
    PIP := .\.venv\Scripts\pip
    UVICORN := .\.venv\Scripts\uvicorn
    ALEMBIC := .\.venv\Scripts\alembic
    RM := rmdir /s /q
    CLEAN_PYCACHE := del /s /q __pycache__
    CLEAN_TEST_CACHE := rmdir /s /q .pytest_cache
    PYTHON_CMD := python
else
    DETECTED_OS := $(shell uname -s)
    ACTIVATE_CMD = . .venv/bin/activate
    PYTHON_PATH := .venv/bin/python
    PIP := .venv/bin/pip
    UVICORN := .venv/bin/uvicorn
    ALEMBIC := .venv/bin/alembic
    RM := rm -rf
    CLEAN_PYCACHE := find . -type d -name '__pycache__' -exec rm -rf {} +
    CLEAN_TEST_CACHE := rm -rf .pytest_cache
    PYTHON_CMD := python3
endif

# Targets padrão
.PHONY: all venv install migrate run clean help
all: help

## Cria o ambiente virtual
venv:
	@echo "Criando ambiente virtual para $(DETECTED_OS)..."
	@$(PYTHON_CMD) -m venv $(VENV)
ifeq ($(DETECTED_OS),Windows)
	@echo Ambiente virtual criado. Ative com: $(ACTIVATE_CMD)
else
	@echo "Ambiente virtual criado. Ative com: source $(ACTIVATE_CMD)"
endif

## Instala dependências no ambiente virtual
install: venv
ifeq ($(DETECTED_OS),Windows)
	@cmd /c "$(PIP) install --upgrade pip"
	@cmd /c "$(PIP) install --no-cache-dir -r requirements.txt"
else
	@$(PIP) install --upgrade pip
	@$(PIP) install --no-cache-dir -r requirements.txt
endif
	@echo Dependências instaladas.

## Gera e aplica migrations com Alembic
migrate: install
ifeq ($(DETECTED_OS),Windows)
	@cmd /c "$(ALEMBIC) stamp head || true"
	@cmd /c "$(ALEMBIC) revision --autogenerate -m \"Auto migration\""
	@cmd /c "$(ALEMBIC) upgrade head"
else
	@$(ALEMBIC) stamp head || true
	@$(ALEMBIC) revision --autogenerate -m "Auto migration"
	@$(ALEMBIC) upgrade head
endif
	@echo Migrations aplicadas.

## Roda o servidor de desenvolvimento com Uvicorn
run: install
ifeq ($(DETECTED_OS),Windows)
	@cmd /c "$(UVICORN) app.main:app --reload"
else
	@$(UVICORN) app.main:app --reload
endif

## Limpa o ambiente (remove venv e caches)
clean:
ifeq ($(DETECTED_OS),Windows)
	@if exist $(VENV) $(RM) $(VENV)
	@$(CLEAN_PYCACHE) 2>nul
	@if exist .pytest_cache $(CLEAN_TEST_CACHE) 2>nul
else
	@$(RM) $(VENV)
	@$(CLEAN_PYCACHE)
	@$(CLEAN_TEST_CACHE)
endif
	@echo Limpeza concluída.

## Lista os targets disponíveis
help:
	@echo Uso: make [target]
	@echo Targets disponíveis:
	@echo "  venv      - cria o ambiente virtual"
	@echo "  install   - instala dependências no venv"
	@echo "  migrate   - gera e aplica migrations com Alembic"
	@echo "  run       - roda o servidor (Uvicorn)"
	@echo "  clean     - remove venv e caches"
	@echo "  help      - mostra esta mensagem"