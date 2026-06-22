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

    return {
        "id": document.id,
        "filename": document.filename,
        "message": "PDF stored successfully"
    }
    
def get_all_files(db: Session):
    return db.query(PDFDocument).all()
