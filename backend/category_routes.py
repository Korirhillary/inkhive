from auth import get_current_user
from database import SessionLocal, engine, get_db
from fastapi import APIRouter, Depends, HTTPException
from models import Category, User
from schemas import CategoryCreate
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/")
def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new category
    """
    category = Category(name=category_data.name, creator_id=current_user.id)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.get("/")
def list_categories(db: Session = Depends(get_db)):
    """Get all categories"""
    return db.query(Category).all()


@router.get("/{category_id}")
def read_category(category_id: int, db: Session = Depends(get_db)):
    """Get category by ID"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.put("/{category_id}")
def update_category(category_id: int, name: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Update a category
    """
    category = db.query(Category).filter(Category.id == category_id, Category.creator_id == current_user.id).first()
    if not category:
        raise HTTPException(status_code=403, detail="Not authorized to update this category")
    category.name = name
    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Delete a category
    """
    category = db.query(Category).filter(Category.id == category_id, Category.creator_id == current_user.id).first()
    if not category:
        raise HTTPException(status_code=403, detail="Not authorized to delete this category")
    db.delete(category)
    db.commit()
    return {"detail": "Category deleted"}
