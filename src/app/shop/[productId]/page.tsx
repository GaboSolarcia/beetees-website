"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/shop/Navbar";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { ChevronLeft, ShoppingCart, Minus, Plus } from "lucide-react";

type ProductImage = { id: string; url: string; isPrimary: boolean; order: number; colorLabel: string | null };

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string;
  sizes: string | null;
  artist: { name: string };
  images: ProductImage[];
};

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((r) => r.json())
      .then((data: Product) => {
        setProduct(data);
        setLoading(false);
        // Pre-select the first color if any images have color labels
        const firstColored = data.images.find((i) => i.colorLabel);
        if (firstColored?.colorLabel) setSelectedColor(firstColored.colorLabel);
      });
  }, [productId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen bg-black flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </main>
      </>
    );
  }

  if (!product) return null;

  const sizes = product.sizes ? product.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];

  // Unique color labels in order of first appearance
  const colorLabels = Array.from(
    new Set(product.images.map((i) => i.colorLabel).filter((c): c is string => !!c))
  );
  const hasColors = colorLabels.length > 0;

  // Images filtered to the active color (or all if no color system)
  const visibleImages = hasColors && selectedColor
    ? product.images.filter((i) => i.colorLabel === selectedColor)
    : product.images;

  function handleColorSelect(color: string) {
    setSelectedColor(color);
    const idx = product!.images.findIndex((i) => i.colorLabel === color);
    if (idx !== -1) setActiveImage(idx);
  }

  function handleThumbnailClick(globalIdx: number) {
    setActiveImage(globalIdx);
    const label = product!.images[globalIdx]?.colorLabel;
    if (label) setSelectedColor(label);
  }

  const displayedImage = product.images[activeImage] ?? primaryImage;

  function handleAddToCart() {
    if (sizes.length > 0 && !selectedSize) {
      toast.error("Selecciona una talla");
      return;
    }
    if (hasColors && !selectedColor) {
      toast.error("Selecciona un color");
      return;
    }
    if (!product!.price) {
      toast.error("Este producto no tiene precio definido");
      return;
    }
    addItem({
      productId: product!.id,
      name: product!.name,
      price: product!.price,
      image: primaryImage?.url ?? null,
      size: selectedSize,
      quantity,
      artistName: product!.artist.name,
    });
    toast.success("Agregado al carrito");
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors"
          >
            <ChevronLeft size={16} />
            Volver
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/10">
                {displayedImage ? (
                  <Image
                    src={displayedImage.url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white/20 text-sm">Sin imagen</div>
                )}
                <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {product.category}
                </div>
              </div>

              {visibleImages.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                  {visibleImages.map((img) => {
                    const globalIdx = product.images.indexOf(img);
                    return (
                      <button
                        key={img.id}
                        onClick={() => handleThumbnailClick(globalIdx)}
                        className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                          globalIdx === activeImage ? "border-yellow-400" : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <Image src={img.url} alt={`${product.name} ${globalIdx + 1}`} fill className="object-cover" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <p className="text-white/40 text-sm font-medium mb-1">{product.artist.name}</p>
              <h1 className="text-4xl font-black text-white tracking-tighter mb-4">{product.name}</h1>

              {product.price ? (
                <p className="text-3xl font-black text-yellow-400 mb-6">
                  ₡{product.price.toLocaleString("es-CR")}
                </p>
              ) : (
                <p className="text-white/30 text-sm mb-6">Precio no disponible</p>
              )}

              {product.description && (
                <p className="text-white/60 text-sm leading-relaxed mb-6">{product.description}</p>
              )}

              {/* Color selector */}
              {hasColors && (
                <div className="mb-6">
                  <p className="text-white/70 text-sm font-medium mb-3">
                    Color
                    {selectedColor && <span className="text-white/40 font-normal ml-2">— {selectedColor}</span>}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {colorLabels.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                          selectedColor === color
                            ? "border-yellow-400 bg-yellow-400 text-black"
                            : "border-white/20 text-white hover:border-white/50"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size selector */}
              {sizes.length > 0 && (
                <div className="mb-6">
                  <p className="text-white/70 text-sm font-medium mb-3">Talla</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                          selectedSize === size
                            ? "border-yellow-400 bg-yellow-400 text-black"
                            : "border-white/20 text-white hover:border-white/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <p className="text-white/70 text-sm font-medium mb-3">Cantidad</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-white font-bold text-lg w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.price}
                className="flex items-center justify-center gap-2 bg-yellow-400 text-black font-black text-lg px-8 py-4 rounded-2xl hover:bg-yellow-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
