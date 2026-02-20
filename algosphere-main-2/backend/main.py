from datetime import datetime, timedelta, timezone
from typing import Annotated, Generator

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import create_database_session, database_engine

models.DatabaseModel.metadata.create_all(bind=database_engine)

app = FastAPI()

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def yield_database_session() -> Generator[Session, None, None]:
    active_session = create_database_session()
    try:
        yield active_session
    finally:
        active_session.close()

JWT_SECRET_KEY = "dev_secret_key_change_this_in_production"
HASHING_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRATION_MINUTES = 30

oauth2_bearer_scheme = OAuth2PasswordBearer(tokenUrl="token")

def generate_jwt_access_token(token_payload: dict, expires_delta: timedelta | None = None) -> str:
    data_to_encode = token_payload.copy()
    if expires_delta:
        token_expiration_time = datetime.now(timezone.utc) + expires_delta
    else:
        token_expiration_time = datetime.now(timezone.utc) + timedelta(minutes=15)
    
    data_to_encode.update({"exp": token_expiration_time})
    return jwt.encode(data_to_encode, JWT_SECRET_KEY, algorithm=HASHING_ALGORITHM)

async def retrieve_authenticated_user(
    auth_token: Annotated[str, Depends(oauth2_bearer_scheme)], 
    database_session: Session = Depends(yield_database_session)
) -> models.UserRecord:
    authentication_failure_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        decoded_jwt_payload = jwt.decode(auth_token, JWT_SECRET_KEY, algorithms=[HASHING_ALGORITHM])
        user_email: str = decoded_jwt_payload.get("sub")
        if user_email is None:
            raise authentication_failure_exception
        token_data_payload = schemas.TokenPayload(email=user_email)
    except JWTError:
        raise authentication_failure_exception
    
    user_record = crud.retrieve_user_record_by_email(database_session, target_email=token_data_payload.email)
    if user_record is None:
        raise authentication_failure_exception
        
    return user_record

@app.post("/register", response_model=schemas.UserResponse)
def register_user_endpoint(
    registration_request: schemas.UserRegistrationRequest, 
    database_session: Session = Depends(yield_database_session)
) -> models.UserRecord:
    existing_user_record = crud.retrieve_user_record_by_email(database_session, target_email=registration_request.email)
    if existing_user_record:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    return crud.register_new_user_record(database_session=database_session, user_data=registration_request)

@app.post("/token", response_model=schemas.AuthenticationToken)
async def authenticate_user_endpoint(
    authentication_form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    database_session: Session = Depends(yield_database_session)
) -> dict:
    user_record = crud.retrieve_user_record_by_email(database_session, target_email=authentication_form_data.username)
    
    is_credentials_valid = user_record and crud.verify_is_password_match(
        plain_password_text=authentication_form_data.password, 
        hashed_password_text=user_record.hashed_password
    )
    
    if not is_credentials_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expiration = timedelta(minutes=ACCESS_TOKEN_EXPIRATION_MINUTES)
    jwt_access_token = generate_jwt_access_token(
        token_payload={"sub": user_record.email}, 
        expires_delta=access_token_expiration
    )
    
    return {"access_token": jwt_access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserResponse)
async def retrieve_current_user_profile_endpoint(
    authenticated_user: Annotated[schemas.UserResponse, Depends(retrieve_authenticated_user)],
) -> models.UserRecord:
    return authenticated_user
