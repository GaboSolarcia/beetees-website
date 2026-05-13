import { prisma } from "@/lib/db";
import EventForm from "@/components/admin/EventForm";

export default async function NewEvent() {
  const artists = await prisma.artist.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-2xl mt-10 md:mt-0">
      <h1 className="text-3xl font-black text-white tracking-tight mb-8">Nuevo Evento</h1>
      <EventForm artists={artists} />
    </div>
  );
}
