import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beetees Costa Rica – Merch de Artistas",
  description: "La mejor tienda de merch de conciertos y eventos en Costa Rica.",
  openGraph: {
    title: "Beetees Costa Rica",
    description: "Merch oficial de tus artistas favoritos",
    siteName: "Beetees CR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geist.className} bg-black text-white antialiased`}>
        <CartProvider>
          {children}
          <Toaster richColors position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}
