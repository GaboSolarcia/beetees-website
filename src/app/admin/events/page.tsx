import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Calendar } from "lucide-react";
import DeleteEventButton from "@/components/admin/DeleteEventButton";

export default async function AdminEvents() {
  const events = await prisma.event.findMany({
    orderBy: [{ date: "asc" }, { order: "asc" }],
    include: { artist: true },
  });

  return (
    <div className="max-w-5xl mt-10 md:mt-0">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Próximos Eventos</h1>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 bg-yellow-400 text-black font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-300 transition-colors text-sm"
        >
          <Plus size={16} />
          Nuevo evento
        </Link>
      </div>

      <div className="space-y-3">
        {events.map((event) => {
          const eventDate = new Date(event.date);
          const isPast = eventDate < new Date();
          return (
            <div
              key={event.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/10">
                {event.posterImage ? (
                  <Image src={event.posterImage} alt={event.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <Calendar size={24} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate">{event.name}</p>
                <p className="text-white/40 text-sm truncate">
                  {event.artist.name} · {event.venue}
                </p>
                <p className="text-yellow-400/70 text-xs mt-0.5">
                  {eventDate.toLocaleDateString("es-CR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              <div className="flex gap-2 items-center flex-shrink-0">
                {isPast && (
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/40">Pasado</span>
                )}
                <span className={`text-xs px-2 py-1 rounded-full ${event.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {event.isActive ? "Activo" : "Inactivo"}
                </span>
                <Link
                  href={`/admin/events/${event.id}`}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <Pencil size={14} />
                  Editar
                </Link>
                <DeleteEventButton id={event.id} name={event.name} />
              </div>
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="text-center py-20 text-white/30">
            No hay eventos aún.{" "}
            <Link href="/admin/events/new" className="text-yellow-400">Crea el primero →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
