from fastapi import HTTPException, UploadFile # type: ignore
from sqlalchemy.orm import Session # type: ignore

from models import PDFDocument


async def upload_pdf(db: Session, file: UploadFile):

    pdf_bytes = await file.read()

    document = PDFDocument(
        filename=file.filename,
        content_type=file.content_type,
        file_data=pdf_bytes
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document
    
def get_all_files(db: Session):
    return db.query(PDFDocument).all()

def get_file_by_id(db: Session, file_id: int):
    return db.query(PDFDocument).filter(PDFDocument.id == file_id).first()

def delete_file(db: Session, file_id: int):
    document = get_file_by_id(db, file_id)
    if document:
        db.delete(document)
        db.commit()
    return document
