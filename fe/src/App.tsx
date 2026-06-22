import { useEffect, useState } from "react";
import { fetchPDFs, deletePDF, PDFItem } from "./api/pdf";
import PDFList from "./components/PDFList";
import PDFUpload from "./components/PDFUpload";
import PDFViewer from "./components/PDFViewer";

import "./App.css";

export default function App() {
  const [pdfs, setPdfs] = useState<PDFItem[]>([]);
  const [selected, setSelected] = useState<PDFItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  async function loadPDFs() {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await fetchPDFs();
      setPdfs(data);
    } catch {
      setFetchError("Could not load PDFs. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPDFs();
  }, []);

  function handleUploaded(pdf: PDFItem) {
    setPdfs((prev) => [pdf, ...prev]);
    setSelected(pdf);
  }

  async function handleDelete(id: number) {
    await deletePDF(id);
    setPdfs((prev) => prev.filter((p) => p.id !== id));
    setSelected((prev) => (prev?.id === id ? null : prev));
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="app-title">SpeakPDF</h1>
          <PDFUpload onUploaded={handleUploaded} />
        </div>
        {fetchError ? (
          <p className="list-status error">{fetchError}</p>
        ) : (
          <PDFList
            pdfs={pdfs}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </aside>

      <main className="main-panel">
        <PDFViewer
          fileId={selected?.id ?? null}
          filename={selected?.filename ?? null}
        />
      </main>
    </div>
  );
}
