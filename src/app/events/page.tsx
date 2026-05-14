import { prisma } from "@/lib/db";
import Navbar from "@/components/shop/Navbar";
import Image from "next/image";
import ProductCard from "@/components/shop/ProductCard";
import { Calendar, MapPin } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { isActive: true },
    orderBy: [{ date: "asc" }, { order: "asc" }],
    include: {
      artist: {
        include: {
          products: {
            where: { isActive: true },
            orderBy: { order: "asc" },
            include: { images: { orderBy: { order: "asc" } } },
          },
        },
      },
    },
  });

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= now);
  const past = events.filter((e) => new Date(e.date) < now);

  function EventBlock({ event }: { event: typeof events[0] }) {
    const eventDate = new Date(event.date);
    return (
      <div className="mb-20">
        {/* Event header */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 mb-8">
          {event.posterImage ? (
            <div className="relative h-72 sm:h-96">
              <Image src={event.posterImage} alt={event.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <Calendar size={48} className="text-white/20" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-2">
              {eventDate.toLocaleDateString("es-CR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              {" · "}
              {eventDate.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" })}
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter">{event.name}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-white/60 text-sm">
                <MapPin size={14} />
                {event.venue}{event.location ? ` · ${event.location}` : ""}
              </span>
              <span className="text-white/60 text-sm">Artista: {event.artist.name}</span>
            </div>
            {event.description && (
              <p className="text-white/50 mt-3 max-w-2xl text-sm">{event.description}</p>
            )}
          </div>
        </div>

        {/* Artist merch */}
        {event.artist.products.length > 0 && (
          <div>
            <h3 className="text-xl font-black text-white tracking-tight mb-1">
              Merch de {event.artist.name}
            </h3>
            <p className="text-white/40 text-sm mb-6">
              Consigue tu merch para el evento
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {event.artist.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {event.artist.products.length === 0 && (
          <p className="text-white/30 text-sm">Próximamente merch disponible para este evento.</p>
        )}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Próximos Eventos</h1>
          <p className="text-white/50 mb-16">Shows, festivales y conciertos en Costa Rica</p>

          {upcoming.length === 0 && past.length === 0 && (
            <div className="text-center py-32 text-white/30">
              Próximamente eventos disponibles.
            </div>
          )}

          {upcoming.map((event) => (
            <EventBlock key={event.id} event={event} />
          ))}

          {past.length > 0 && (
            <>
              <div className="border-t border-white/10 my-12" />
              <h2 className="text-2xl font-black text-white/40 tracking-tight mb-10">Eventos pasados</h2>
              <div className="opacity-50">
                {past.map((event) => (
                  <EventBlock key={event.id} event={event} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
