from pydantic import BaseModel

class UserBaseSchema(BaseModel):
    email: str
    name: str | None = None

class UserRegistrationRequest(UserBaseSchema):
    password: str

class UserResponse(UserBaseSchema):
    id: int
    
    class Config:
        from_attributes = True

class AuthenticationToken(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    email: str | None = None
