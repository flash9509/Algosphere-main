from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLITE_DATABASE_URL = "sqlite:///./sql_app.db"

database_engine = create_engine(
    SQLITE_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

create_database_session = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=database_engine
)

DatabaseModel = declarative_base()
