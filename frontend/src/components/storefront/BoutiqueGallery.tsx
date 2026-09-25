"use client";
import { useEffect, useRef } from "react";

export function BoutiqueGallery() {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGallery = () => {
      if (typeof window === "undefined" || !galleryRef.current) return;
      
      const sdk = (window as any).boutique || (window as any).BoutiqueSDK;
      if (!sdk) return;

      const gallery = sdk.gallery || (window as any).boutique?.gallery;
      const whatsapp = sdk.whatsapp || (window as any).boutique?.whatsapp;

      const mountFn = gallery?.mount || gallery?.mountGallery;
      if (typeof mountFn === "function") {
        mountFn.call(gallery, galleryRef.current, {
          category: "all",
          onProductClick: (item: any) => {
            // Open WhatsApp checkout link
            whatsapp?.openChat?.({
              productName: item.title || item.fileName || item.name,
              price: item.price || 0,
              imageUrl: item.fileUrl || item.imageUrl,
            });
          },
        });
      }
    };

    if (document.readyState === "complete" || (window as any).boutique) {
      initGallery();
    } else {
      window.addEventListener("DOMContentLoaded", initGallery);
      const timer = setTimeout(initGallery, 1000);
      return () => {
        window.removeEventListener("DOMContentLoaded", initGallery);
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-serif text-slate-900 mb-8 text-center">Exclusive Couture & Saree Collections</h2>
      <div ref={galleryRef} id="boutique-gallery-container" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" />
    </section>
  );
}
