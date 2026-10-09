
import { useState } from "react";
import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function DocumentScanner({ onTextExtracted }) {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0];

    setFile(null);
    setExtractedText("");
    setError("");
    setProgress(0);

    if (!selectedFile) return;

    const extension = selectedFile.name.split(".").pop().toLowerCase();
    const supported =
      selectedFile.type.startsWith("image/") ||
      extension === "pdf" ||
      extension === "txt";

    if (!supported) {
      setError("Please upload an image, PDF, or TXT file.");
      return;
    }

    setFile(selectedFile);
  }

  async function extractImageText(selectedFile) {
    let worker;

    try {
      worker = await createWorker("eng", 1, {
        logger: (message) => {
          if (message.status === "recognizing text") {
            setProgress(Math.round(message.progress * 100));
          }
        },
      });

      const result = await worker.recognize(selectedFile);
      return result.data.text.trim();
    } finally {
      if (worker) await worker.terminate();
    }
  }

  async function extractPdfText(selectedFile) {
    const buffer = await selectedFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");

      pages.push(pageText);
      setProgress(Math.round((pageNumber / pdf.numPages) * 100));
    }

    return pages.join("\n\n").trim();
  }

  async function handleExtract() {
    if (!file) {
      setError("Please choose a document first.");
      return;
    }

    setLoading(true);
    setError("");
    setExtractedText("");
    setProgress(0);

    try {
      const extension = file.name.split(".").pop().toLowerCase();
      let text = "";

      if (file.type.startsWith("image/")) {
        text = await extractImageText(file);
      } else if (extension === "pdf") {
        text = await extractPdfText(file);
      } else if (extension === "txt") {
        text = (await file.text()).trim();
      }

      if (!text) {
        setError(
          "No text was found. This may be a scanned PDF or an unclear image. Try a text-based PDF or a clearer image."
        );
        return;
      }

      setExtractedText(text);
      onTextExtracted?.(text);
    } catch (err) {
      console.error("Document extraction failed:", err);
      setError(
        "Could not read this document. Try another file or check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="scanner-section">
      <label className="upload-box">
        <input
          type="file"
          accept="image/*,.pdf,.txt"
          onChange={handleFileChange}
          disabled={loading}
        />
        <span className="upload-icon">↑</span>
        <strong>{file?.name || "Choose your document"}</strong>
        <span className="upload-help">
          Upload an image, PDF, or TXT file.
        </span>
        <span className="upload-button">Browse files</span>
      </label>

      <button
        type="button"
        className="primary-button"
        onClick={handleExtract}
        disabled={!file || loading}
      >
        {loading
          ? `Extracting text... ${progress}%`
          : "Extract Text"}
      </button>

      {loading && (
        <p role="status">Reading your document. Please wait...</p>
      )}

      {error && (
        <p className="scanner-error" role="alert">
          {error}
        </p>
      )}

      {extractedText && (
        <section className="scanner-result" aria-live="polite">
          <h3>Extracted Text</h3>
          <pre>{extractedText}</pre>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(extractedText)}
          >
            Copy Text
          </button>
        </section>
      )}
    </div>
  );
}
