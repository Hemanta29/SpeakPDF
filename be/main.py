from fastapi import FastAPI, Depends, HTTPException, UploadFile, File # type: ignore
from sqlalchemy.orm import Session # type: ignore

from database import SessionLocal, engine, Base
from models import User
from schemas import UserCreate, UserResponse, PDFResponse
from services import file as file_service
from services import user as user_service



Base.metadata.create_all(bind=engine)
print("Database connected successfully.")

app = FastAPI(
    title="Speak PDF API",
    description="Upload PDF and it will read it out for you using FastAPI",
    version="1.0.0"
    )


# Dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CREATE
@app.post("/users", tags=["Users"], response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    return user_service.create_user(db, user)

@app.get("/users", tags=["Users"], response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db)
):
    return user_service.get_users(db)

# READ ONE
@app.get("/users/{user_id}", tags=["Users"], response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = user_service.get_user(db, user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user

# UPDATE
@app.put("/users/{user_id}", tags=["Users"], response_model=UserResponse)
def update_user(
    user_id: int,
    user: UserCreate,
    db: Session = Depends(get_db)
):
    updated_user = user_service.update_user(
        db,
        user_id,
        user
    )

    if not updated_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return updated_user

# DELETE
@app.delete("/users/{user_id}", tags=["Users"])
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = user_service.delete_user(db, user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "message": "User deleted successfully"
    }

# Upload PDF
@app.post("/upload-pdf", tags=["PDF"], response_model=PDFResponse)
async def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )
        
    return await file_service.upload_pdf(db, file)

# Get All PDF

@app.get("/files", tags=["PDF"], response_model=list[PDFResponse])
def get_files(
    db: Session = Depends(get_db)
):
    return file_service.get_all_files(db)

@app.get("/", tags=["Default"])
def read_root():
    return {"status": "healthy", "message": "FastAPI application is running successfully."}
