from pydantic import BaseModel, EmailStr, constr


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

class CategoryUpdate(BaseModel):
    name: constr(min_length=1, max_length=100)


class PostCreate(BaseModel):
    title: str
    content: str
    category_id: int

    class Config:
        orm_mode = True
