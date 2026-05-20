from pydantic import BaseModel
from models import Todo


class Todo(BaseModel):
    Title : str
    Description : str
    Completed : bool= False


class TodoCreate(Todo):
    pass

class Todoschema(Todo):
    id : int

    class Config:
        orm_model = True