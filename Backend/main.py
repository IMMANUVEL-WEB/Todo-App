from fastapi import FastAPI, Depends, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from database import engine, base, get_db
from models import Todo
from schemas import TodoCreate, Todoschema
from sqlalchemy.orm import Session
base.metadata.create_all(bind=engine)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/todos", response_model=Todoschema)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    todo = Todo(**todo.dict())
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo

@app.get("/todos", response_model=list[Todoschema])
def get_all(db: Session = Depends(get_db)):
    todos = db.query(Todo).all()
    return todos


@app.get("/todos/{todo_id}", response_model=Todoschema)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo 

@app.put("/todos/{todo_id}", response_model=Todoschema)
def Update_todo(todo_id: int, updated: TodoCreate, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not Found")
    todo.Title = updated.Title
    todo.Description = updated.Description
    todo.Completed = updated.Completed
    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not Found")
    db.delete(todo)
    db.commit()
    return {"message": "Todo deleted successfully"}
    