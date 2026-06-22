import { useState } from "react";
import { PDFItem } from "../api/pdf";
import ConfirmModal from "./ConfirmModal";

interface Props {
  pdfs: PDFItem[];
  selectedId: number | null;
  onSelect: (pdf: PDFItem) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export default function PDFList({ pdfs, selectedId, onSelect, onDelete, loading }: Props) {
  const [pending, setPending] = useState<PDFItem | null>(null);

  if (loading) return <p className="list-status">Loading…</p>;
  if (pdfs.length === 0) return <p className="list-status">No PDFs yet. Upload one!</p>;

  return (
    <>
      <ul className="pdf-list">
        {pdfs.map((pdf) => (
          <li
            key={pdf.id}
            className={`pdf-list-item${selectedId === pdf.id ? " selected" : ""}`}
            onClick={() => onSelect(pdf)}
            title={pdf.filename}
          >
            <span className="pdf-icon">📄</span>
            <span className="pdf-name">{pdf.filename}</span>
            <button
              className="pdf-delete-btn"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                setPending(pdf);
              }}
            >
              🗑
            </button>
          </li>
        ))}
      </ul>

      {pending && (
        <ConfirmModal
          filename={pending.filename}
          onConfirm={() => {
            onDelete(pending.id);
            setPending(null);
          }}
          onCancel={() => setPending(null)}
        />
      )}
    </>
  );
}
