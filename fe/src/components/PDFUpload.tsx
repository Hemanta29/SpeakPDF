import { useRef, useState } from "react";
import { uploadPDF, PDFItem } from "../api/pdf";

interface Props {
  onUploaded: (pdf: PDFItem) => void;
}

export default function PDFUpload({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const pdf = await uploadPDF(file);
      onUploaded(pdf);
    } catch {
      setError("Upload failed. Make sure it's a PDF.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="upload-area">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        id="pdf-input"
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <button
        className="upload-btn"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Uploading…" : "+ Upload PDF"}
      </button>
      {error && <p className="upload-error">{error}</p>}
    </div>
  );
}
