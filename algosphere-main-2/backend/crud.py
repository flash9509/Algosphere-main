from sqlalchemy.orm import Session
from . import models, schemas
import bcrypt

def verify_is_password_match(plain_password_text: str, hashed_password_text: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password_text.encode('utf-8'),
            hashed_password_text.encode('utf-8')
        )
    except ValueError:
        return False

def generate_password_hash(password_text: str) -> str:
    password_bytes = password_text.encode('utf-8')
    salt_bytes = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt_bytes).decode('utf-8')

def retrieve_user_record_by_id(database_session: Session, target_user_id: int) -> models.UserRecord | None:
    return database_session.query(models.UserRecord).filter(models.UserRecord.id == target_user_id).first()

def retrieve_user_record_by_email(database_session: Session, target_email: str) -> models.UserRecord | None:
    return database_session.query(models.UserRecord).filter(models.UserRecord.email == target_email).first()

def register_new_user_record(database_session: Session, user_data: schemas.UserRegistrationRequest) -> models.UserRecord:
    hashed_password_text = generate_password_hash(user_data.password)
    new_user_record = models.UserRecord(
        email=user_data.email, 
        name=user_data.name, 
        hashed_password=hashed_password_text
    )
    database_session.add(new_user_record)
    database_session.commit()
    database_session.refresh(new_user_record)
    return new_user_record
