import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ...
load_dotenv(encoding="utf-8")
DATABASE_URL = os.getenv("DATABASE_URL")
print("→ carregou DATABASE_URL:", repr(DATABASE_URL))   # <— adicione isto

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()