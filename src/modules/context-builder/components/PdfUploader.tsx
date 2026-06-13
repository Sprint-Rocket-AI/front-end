import { useState, useCallback, useRef } from "react";
import { indexPdf } from "../../../services/AIService";

interface PdfUploaderProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const PdfUploader = ({ onSuccess, onError }: PdfUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      onError("Por favor, sube un archivo PDF válido.");
      return;
    }

    setIsUploading(true);
    try {
      await indexPdf(file);
      onSuccess(`El archivo "${file.name}" fue cargado correctamente.`);
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      onError("Ocurrió un error al cargar el PDF.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="mt-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
          isDragging
            ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
            : "border-slate-300 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800"
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div className="text-4xl mb-4">📄</div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
          {isUploading
            ? "Subiendo y procesando PDF..."
            : "Haz clic o arrastra un documento PDF aquí para indexarlo"}
        </p>
        {!isUploading && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Solo archivos .pdf son soportados
          </p>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        className="hidden"
      />
    </div>
  );
};
