from sqlalchemy import Column, Integer, String, Boolean
from database import base

class Todo(base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    Title = Column(String, nullable=False)
    Description = Column(String, nullable=False)
    Completed = Column(Boolean, default=False)


