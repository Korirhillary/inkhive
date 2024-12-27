import category_routes
import post_routes
import user_routes
from database import SessionLocal, engine, get_db
from fastapi import APIRouter, Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from models import Base, Category, Post, User

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(post_routes.router, prefix="/posts", tags=["Posts"])
app.include_router(category_routes.router, prefix="/categories", tags=["Categories"])


@app.get("/")
def home():
    return {"status": "Home"}


@app.get("/healthz")
def healthz():
    return {"status": "Healthy"}
