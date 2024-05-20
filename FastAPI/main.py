from fastapi import FastAPI, HTTPException, Depends, status
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from passlib.context import CryptContext # type: ignore
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt # type: ignore

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')

models.Base.metadata.create_all(bind=engine)
 
origins = [
    'http://localhost:3000',
    "http://frontenddomain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]

)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated='auto')
SECRET_KEY = '123drt21s4r25yu34v6ui54b7ui54bniob14u21vcy12c4yv53427iop5n7io34b5yui31fc4uy8c9xv67xc7b5fd685sdf6v94z67d4'
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES= 30


class PostBase(BaseModel):
    title: str
    content: str
    user_id: int | None = None
    
class UserBase(BaseModel):
    username: str
    password: str     
    
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()    

db_dependency = Annotated[Session, Depends(get_db)]


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()
def create_user(user: UserBase, db: db_dependency):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    return 'Complete'

def authenticate_user(username: str, password: str, db: Session):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        return False
    if not pwd_context.verify(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str = Depends(oauth2_scheme)):
    try: 
        payload = jwt.decode(token, SECRET_KEY, algorithms={ALGORITHM})
        username: str = payload.get('sub')
        if username is None:
            raise HTTPException(status_code=403, detail="Token invalid or expired")
        return payload
    except JWTError:
        raise HTTPException(status_code=403, detail="Token invalid or expired")

def create_post(post: PostBase, db: db_dependency):
    db_post = models.Post(title=post.title, content=post.content, user_id=post.user_id)
    db.add(db_post)
    db.commit()
    return 'Complete'
    
def get_posts(db: db_dependency):
    Posts = db.query(models.Post).options(joinedload(models.Post.user)).all()
    return Posts

def delete_posts(post_id: int,db: db_dependency):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if post:
        db.delete(post)
        db.commit()
        return 'Post deleted successfully'
    else:
        return 'Post not found'
    
def update_post(post_id: int, newPost: PostBase, db: db_dependency):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if post:
        post.title = newPost.title
        post.content = newPost.content
        db.commit()
        return 'Post updated successfully'
    else:
        return 'Post not found'
        
    

@app.post('/register')
def register_user(user: UserBase, db: Session = Depends(get_db)):
    db_user = get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'User with username {user.username} already exists'
        )
    return create_user(user=user, db=db)
    
@app.put('/update-post/{post_id}')
async def update_user_post(post_id: int, newPost: PostBase, db: Session = Depends(get_db)):
    return update_post(post_id=post_id, newPost=newPost, db=db)

@app.post("/create-post")
def create_user_post(post: PostBase, db: Session = Depends(get_db)):
    return create_post(post=post, db=db)

@app.get('/get-posts')
async def get_user_posts(db: Session = Depends(get_db)):
    return get_posts(db=db)

@app.delete('/delete-post/{post_id}')
async def delete_user_posts(post_id: int ,db: Session = Depends(get_db)):
    return delete_posts(post_id=post_id, db=db)

@app.get('/users/{username}', status_code=status.HTTP_200_OK)
async def get_user(username: str, db: db_dependency):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'User with id {username} not found'
        )
    return user


@app.get('/users/by-id/{user_id}', status_code=status.HTTP_200_OK)
async def get_user(user_id: int, db: db_dependency):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'User with id {user_id} not found'
        )
    return user


@app.post('/token')
def login_for_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
            headers={'WWW-Authenticate': 'Bearer'}
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={'sub': user.username},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type":"bearer"}



@app.get('/verify_token/{token}')
async def verify_user_token(token: str):
    payload = verify_token(token=token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
            headers={'WWW-Authenticate': 'Bearer'}
        )
    
    return {"payload": payload}




