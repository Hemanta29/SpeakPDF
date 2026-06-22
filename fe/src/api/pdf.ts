export interface PDFItem {
  id: number;
  filename: string;
  content_type: string;
}

export async function fetchPDFs(): Promise<PDFItem[]> {
  const res = await fetch("/files");
  if (!res.ok) throw new Error("Failed to fetch PDFs");
  return res.json();
}

export async function uploadPDF(file: File): Promise<PDFItem> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/upload-pdf", { method: "POST", body: form });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export function getPDFUrl(id: number): string {
  return `/files/${id}`;
}

export async function deletePDF(id: number): Promise<void> {
  const res = await fetch(`/files/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed");
}
