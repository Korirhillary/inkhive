from auth import get_current_user
from database import SessionLocal, engine, get_db
from fastapi import APIRouter, Depends, FastAPI, HTTPException, status
from models import Base, Category, Post, User
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/")
def create_post(title: str, content: str, category_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = Post(title=title, content=content, category_id=category_id, author_id=current_user.id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.get("/")
def list_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()


@router.get("/{post_id}")
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.put("/{post_id}")
def update_post(post_id: int, title: str, content: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id, Post.author_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=403, detail="Not authorized to update this post")
    post.title = title
    post.content = content
    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id, Post.author_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    db.delete(post)
    db.commit()
    return {"detail": "Post deleted"}
