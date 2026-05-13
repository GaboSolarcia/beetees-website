import ArtistForm from "@/components/admin/ArtistForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewArtistPage() {
  return (
    <div className="max-w-2xl mt-10 md:mt-0">
      <Link href="/admin/artists" className="flex items-center gap-1 text-white/50 hover:text-white text-sm mb-6 transition-colors">
        <ChevronLeft size={16} /> Volver a artistas
      </Link>
      <h1 className="text-3xl font-black text-white tracking-tight mb-8">Nuevo artista</h1>
      <ArtistForm />
    </div>
  );
}
