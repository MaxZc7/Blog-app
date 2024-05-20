from database import Base
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True)
    hashed_password= Column(String(70))
    
    posts = relationship("Post", back_populates="user")
     
class Post(Base):
    __tablename__ = 'posts'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50))
    content = Column(String(150)) 
    user_id = Column(Integer, ForeignKey('users.id'))

    user = relationship("User", back_populates="posts")