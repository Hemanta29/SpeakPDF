from pydantic import BaseModel

class UserCreate(BaseModel):
    name:str
    email:str
    
class UserResponse(UserCreate):
    id:int
    
    class Config:
        from_attributes = True
        
class PDFResponse(BaseModel):
    id: int
    filename: str
    content_type: str

    class Config:
        from_attributes = True