import user_routes
from auth import get_current_user
from database import SessionLocal, engine, get_db
from fastapi import Depends, FastAPI, HTTPException, status
from models import Base, Category, Post, User
from sqlalchemy.orm import Session

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user_routes.router, prefix="/users", tags=["Users"])

@app.get("/healthz")
def healthz():
    return {"status": "Healthy"}


@app.post("/posts/")
def create_post(title: str, content: str, category_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = Post(title=title, content=content, category_id=category_id, author_id=current_user.id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@app.get("/posts/")
def list_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()


@app.get("/posts/{post_id}")
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@app.put("/posts/{post_id}")
def update_post(post_id: int, title: str, content: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id, Post.author_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=403, detail="Not authorized to update this post")
    post.title = title
    post.content = content
    db.commit()
    db.refresh(post)
    return post


@app.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id, Post.author_id == current_user.id).first()
    if not post:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    db.delete(post)
    db.commit()
    return {"detail": "Post deleted"}
