import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import wallpaperImg from "@/assets/service-wallpaper.jpg";
import livingRoomImg from "@/assets/service-living-room.jpg";
import bedroomImg from "@/assets/service-bedroom.jpg";
import kidsRoomImg from "@/assets/service-kids-room.jpg";

export const Route = createFileRoute("/services/wallpaper")({
  head: () => ({
    meta: [
      { title: "Wallpaper Services — Hyderabad Wall Arts" },
      { name: "description", content: "Premium wallpaper services for homes and offices in Hyderabad. Modern, abstract, kids, and nature wallpaper collections." },
      { property: "og:title", content: "Wallpaper Services — Hyderabad Wall Arts" },
      { property: "og:description", content: "Premium wallpaper services for homes and offices." },
    ],
  }),
  component: WallpaperPage,
});

const categories = [
  { name: "All", key: "all" },
  { name: "Modern", key: "modern" },
  { name: "Abstract", key: "abstract" },
  { name: "Kids", key: "kids" },
  { name: "Nature", key: "nature" },
];

const wallpapers = [
  { title: "Modern Geometric", category: "modern", image: wallpaperImg, desc: "Clean geometric patterns for contemporary spaces" },
  { title: "Abstract Waves", category: "abstract", image: livingRoomImg, desc: "Flowing abstract designs with vibrant colors" },
  { title: "Cartoon Paradise", category: "kids", image: kidsRoomImg, desc: "Fun cartoon themes for children's rooms" },
  { title: "Tropical Forest", category: "nature", image: wallpaperImg, desc: "Lush tropical greenery and botanicals" },
  { title: "Minimalist Lines", category: "modern", image: bedroomImg, desc: "Subtle line art for elegant interiors" },
  { title: "Floral Fantasy", category: "nature", image: livingRoomImg, desc: "Beautiful floral patterns in soft colors" },
  { title: "Space Adventure", category: "kids", image: kidsRoomImg, desc: "Galaxy and space-themed designs for kids" },
  { title: "Marble Texture", category: "abstract", image: wallpaperImg, desc: "Premium marble-effect wallpaper" },
];

function WallpaperPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const filtered = activeFilter === "all" ? wallpapers : wallpapers.filter((w) => w.category === activeFilter);

  return (
    <div>
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={wallpaperImg} alt="Wallpaper services" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-primary/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-sm font-semibold tracking-wider uppercase mb-4 backdrop-blur-sm">Premium Collection</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white">Wallpaper Services</h1>
            <p className="mt-4 text-white/80 text-lg max-w-xl">Transform your walls with our premium wallpaper collection.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading subtitle="Our Collection" title="Wallpaper Categories" />

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
                  activeFilter === cat.key
                    ? "gradient-primary text-white shadow-lg"
                    : "bg-card border border-border text-foreground hover:border-primary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((wp, i) => (
              <motion.div
                key={wp.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                layout
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] shadow-lg">
                  <img src={wp.image} alt={wp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider">{wp.category}</span>
                    <h3 className="font-heading font-bold text-lg text-white mt-1">{wp.title}</h3>
                    <p className="text-white/70 text-sm mt-1">{wp.desc}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <Link to="/contact" className="px-6 py-2 rounded-full gradient-primary text-white font-semibold text-sm shadow-lg">
                      Enquire Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white">Need Custom Wallpaper?</h2>
          <p className="mt-3 text-white/80">Get a free consultation for your wallpaper project.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="px-8 py-3.5 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors shadow-lg">Get Free Quote</Link>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#25D366]/90 transition-colors shadow-lg">WhatsApp Us</a>
          </div>
        </div>
      </section>
    </div>
  );
}
