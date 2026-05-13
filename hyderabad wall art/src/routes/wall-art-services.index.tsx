import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import heroImg from "@/assets/hero-slide-1.jpg";
import { useStore, type ServiceContent } from "@/lib/store";

export const Route = createFileRoute("/wall-art-services/")({
  head: () => ({
    meta: [
      { title: "Wall Art Services — Hyderabad Wall Arts" },
      { name: "description", content: "Premium wall art services for homes, offices, and commercial spaces. Explore our full range of artistic solutions." },
      { property: "og:title", content: "Wall Art Services — Hyderabad Wall Arts" },
      { property: "og:description", content: "Premium wall art services for homes, offices, and commercial spaces." },
    ],
  }),
  component: WallArtServicesPage,
});

function WallArtServicesPage() {
  const { services, isLoading } = useStore();

  if (isLoading) {
    return <div className="py-40 text-center">Loading services...</div>;
  }

  // Map services to the card structure
  const activeServices = services.filter((s: ServiceContent) => s.isActive);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Wall Art Services" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-primary/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-sm font-semibold tracking-wider uppercase mb-4 backdrop-blur-sm">
              Our Services
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold text-white">Wall Art Services</h1>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Transform your space with artistic excellence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              We provide customized wall art solutions for homes, offices, and commercial spaces using modern and traditional techniques.
              With 20+ years of experience, our team of expert artists delivers premium quality artwork that transforms any wall into a masterpiece.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading subtitle="Explore" title="Our Service Categories" description="Browse our comprehensive range of wall art services" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeServices.map((service: ServiceContent, i: number) => (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link 
                  to={
                    service.key === "home" ? "/wall-art-services/home/living-room" : 
                    service.key === "commercial" ? "/wall-art-services/commercial/hotels-restaurants" :
                    service.key === "mural" ? "/wall-art-services/mural-paintings" :
                    service.key === "stencil" ? "/wall-art-services/stencil-wall-painting" :
                    "/wall-art-services"
                  } 
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] shadow-xl">
                    <img
                      src={service.images[0] || heroImg}
                      alt={service.label}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent group-hover:from-navy/95 transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="px-6 py-2.5 rounded-full bg-gold text-gold-foreground font-semibold text-sm shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform">
                        View Details
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-heading font-bold text-xl text-white group-hover:text-gold transition-colors">{service.label}</h3>
                      <p className="text-white/70 text-sm mt-2 line-clamp-2">{service.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-gold blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading subtitle="Why Choose Us" title="Why Choose Hyderabad Wall Arts" light />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🏆", title: "20+ Years Experience", desc: "Two decades of transforming spaces across Hyderabad" },
              { icon: "👨‍🎨", title: "Professional Artists", desc: "Team of skilled and experienced professional painters" },
              { icon: "✨", title: "Custom Designs", desc: "Tailored artwork to match your vision and space" },
              { icon: "💰", title: "Affordable Pricing", desc: "Premium quality at competitive market rates" },
              { icon: "🎨", title: "High-Quality Materials", desc: "Only the best paints and materials for lasting beauty" },
              { icon: "⏰", title: "On-Time Delivery", desc: "We ensure timely completion of every project" },
              { icon: "🤝", title: "Free Consultation", desc: "Complimentary design consultation for all clients" },
            ].map((item: { icon: string; title: string; desc: string }, i: number) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
              >
                <span className="text-4xl block mb-4">{item.icon}</span>
                <h3 className="font-heading font-bold text-lg text-white">{item.title}</h3>
                <p className="text-sm text-white/60 mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white">Ready to Transform Your Space?</h2>
            <p className="mt-4 text-lg text-white/80">Get a free consultation and quote for your wall art project today.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-all shadow-lg">
                Contact Us
              </Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#25D366]/90 transition-all shadow-lg">
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
