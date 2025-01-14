from math import ceil
from typing import List, Optional

from auth import get_current_user
from database import SessionLocal, engine, get_db
from fastapi import APIRouter, Depends, HTTPException, Query
from models import Category, CategoryListResponse, CategoryResponse, User, Post
from schemas import CategoryCreate
from sqlalchemy.orm import Session, joinedload

router = APIRouter()

@router.post("/")
def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    category = Category(name=category_data.name, creator_id=current_user.id)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

@router.get("/", response_model=CategoryListResponse)
def list_categories(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    per: int = Query(10, ge=1, le=100, description="Items per page")
):
    total_count = db.query(Category).count()
    num_pages = ceil(total_count / per)
    offset = (page - 1) * per

    categories = (
        db.query(Category)
        .options(joinedload(Category.creator))
        .offset(offset)
        .limit(per)
        .all()
    )

    for category in categories:
        post_count = db.query(Post).filter(Post.category_id == category.id).count()
        category.post_count = post_count  

    next_page = page + 1 if page < num_pages else None
    prev_page = page - 1 if page > 1 else None

    response = {
        "pagination": {
            "count": total_count,
            "next_page": next_page,
            "num_pages": num_pages,
            "page": page,
            "per": per,
            "prev_page": prev_page
        },
        "categories": categories
    }
    
    return response

@router.get("/{category_id}", response_model=CategoryResponse)
def read_category(category_id: int, db: Session = Depends(get_db)):
    category = (
        db.query(Category)
        .join(User, Category.creator_id == User.id)
        .filter(Category.id == category_id)
        .options(joinedload(Category.creator))
        .first()
    )
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return category

@router.put("/{category_id}")
def update_category(category_id: int, name: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    category = db.query(Category).filter(Category.id == category_id, Category.creator_id == current_user.id).first()
    
    if not category:
        raise HTTPException(status_code=403, detail="Not authorized to update this category")
    
    category.name = name
    db.commit()
    db.refresh(category)
    
    return category

@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    category = db.query(Category).filter(Category.id == category_id, Category.creator_id == current_user.id).first()
    
    if not category:
        raise HTTPException(status_code=403, detail="Not authorized to delete this category")
    
    db.delete(category)
    db.commit()
    
    return {"detail": "Category deleted"}
