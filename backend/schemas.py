from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        orm_mode = True


class CategoryCreate(BaseModel):
    name: str

    class Config:
        orm_mode = True


class PostCreate(BaseModel):
    title: str
    title: str
    content: str
    category_id: int

    class Config:
        orm_mode = True
