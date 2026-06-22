import { getPDFUrl } from "../api/pdf";

interface Props {
  fileId: number | null;
  filename: string | null;
}

export default function PDFViewer({ fileId, filename }: Props) {
  if (fileId === null) {
    return (
      <div className="viewer-empty">
        <p>Select a PDF from the list to view it here.</p>
      </div>
    );
  }

  return (
    <div className="viewer-container">
      <div className="viewer-header">{filename}</div>
      <iframe
        key={fileId}
        src={getPDFUrl(fileId)}
        title={filename ?? "PDF Viewer"}
        className="pdf-iframe"
      />
    </div>
  );
}
