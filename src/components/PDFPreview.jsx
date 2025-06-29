import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PDFPreview = ({ blob }) => {
  if (!blob) return null;

  const url = URL.createObjectURL(blob);

  return (
    <div className="mt-6 border rounded shadow-sm">
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
      >
        <Viewer fileUrl={url} />
      </Worker>
    </div>
  );
};

export default PDFPreview;
