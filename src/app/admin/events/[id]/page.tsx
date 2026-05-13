import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import EventForm from "@/components/admin/EventForm";

type Params = { params: Promise<{ id: string }> };

export default async function EditEvent({ params }: Params) {
  const { id } = await params;

  const [event, artists] = await Promise.all([
    prisma.event.findUnique({ where: { id } }),
    prisma.artist.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!event) return notFound();

  return (
    <div className="max-w-2xl mt-10 md:mt-0">
      <h1 className="text-3xl font-black text-white tracking-tight mb-8">Editar Evento</h1>
      <EventForm
        artists={artists}
        initial={{
          id: event.id,
          name: event.name,
          date: event.date.toISOString(),
          venue: event.venue,
          location: event.location,
          description: event.description,
          posterImage: event.posterImage,
          artistId: event.artistId,
          isActive: event.isActive,
          order: event.order,
        }}
      />
    </div>
  );
}
