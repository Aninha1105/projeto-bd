from fastapi import APIRouter
from typing import List

router = APIRouter(prefix="/universidades", tags=["Universidades"])

UNIVERSIDADES = [
    "Universidade de São Paulo (USP)",
    "Universidade Estadual de Campinas (UNICAMP)",
    "Universidade Federal do Rio de Janeiro (UFRJ)",
    "Universidade Federal de Minas Gerais (UFMG)",
    "Universidade Federal do Rio Grande do Sul (UFRGS)"
    "Universidade de Brasília (UnB)"
    
]

@router.get("/", response_model=List[str])
def listar_universidades():
    return UNIVERSIDADES 