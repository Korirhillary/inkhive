from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    posts = relationship("Post", back_populates="author")
    categories = relationship("Category", back_populates="creator")


class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="posts")
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="posts")


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"))
    creator = relationship("User", back_populates="categories")
    posts = relationship("Post", back_populates="category")


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        orm_mode = True


class CategoryResponse(BaseModel):
    id: int
    name: str
    creator: UserResponse
    post_count: int

    class Config:
        orm_mode = True


class PaginationResponse(BaseModel):
    count: int
    next_page: Optional[int]
    num_pages: int
    page: int
    per: int
    prev_page: Optional[int]

class CategoryListResponse(BaseModel):
    pagination: PaginationResponse
    categories: List[CategoryResponse]
