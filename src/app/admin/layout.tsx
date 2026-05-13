import { getSession } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <AdminNav />
      <main className="flex-1 ml-0 md:ml-64 p-6 sm:p-8">
        {children}
      </main>
    </div>
  );
}
