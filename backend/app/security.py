from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# Gera um hash seguro para uma senha em texto puro.
def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)

# Verifica se a senha em texto bate com o hash armazenado.
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
