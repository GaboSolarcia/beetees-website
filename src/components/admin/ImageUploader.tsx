"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  onUpload: (url: string) => void;
  value?: string | null;
  label?: string;
  className?: string;
};

export default function ImageUploader({ onUpload, value, label = "Subir imagen", className = "" }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Error al subir imagen");
      } else {
        onUpload(data.url);
        toast.success("Imagen subida");
      }
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {value ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/20 group">
          <Image src={value} alt="Preview" fill className="object-cover" />
          <button
            onClick={() => onUpload("")}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400/50 hover:bg-yellow-400/5 transition-all"
        >
          {uploading ? (
            <Loader2 size={28} className="text-yellow-400 animate-spin" />
          ) : (
            <>
              <Upload size={28} className="text-white/30 mb-2" />
              <p className="text-white/50 text-sm">{label}</p>
              <p className="text-white/30 text-xs mt-1">JPG, PNG, WebP · Arrastrar o clic</p>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
