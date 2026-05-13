import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

interface ServicePageLayoutProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  benefits?: string[];
  whyChoose: string[];
  relatedServices?: { label: string; to: string }[];
}

export default function ServicePageLayout({ title, subtitle, description, image, benefits, whyChoose, relatedServices }: ServicePageLayoutProps) {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-primary/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-sm font-semibold tracking-wider uppercase mb-4 backdrop-blur-sm">{subtitle}</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white">{title}</h1>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-lg text-muted-foreground leading-relaxed text-center">{description}</p>
          </motion.div>
          {benefits && benefits.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8 flex flex-wrap justify-center gap-3">
              {benefits.map((b) => (
                <span key={b} className="px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">{b}</span>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading subtitle="Our Work" title="Project Gallery" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="aspect-[4/3] rounded-2xl overflow-hidden group shadow-lg"
              >
                <img src={image} alt={`${title} project ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-60 h-60 rounded-full bg-primary blur-[80px]" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-gold blur-[80px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading subtitle="Why Choose Us" title="Why Choose Hyderabad Wall Arts" light />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whyChoose.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-5 flex items-start gap-3"
              >
                <svg className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-white/80">{point}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices && relatedServices.length > 0 && (
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading subtitle="Explore More" title="Related Services" />
            <div className="flex flex-wrap justify-center gap-4">
              {relatedServices.map((s) => (
                <Link key={s.to} to={s.to} className="px-6 py-3 rounded-lg bg-card border border-border text-foreground font-medium hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white">Interested in {title}?</h2>
          <p className="mt-3 text-white/80">Get a free consultation and quote today.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="px-8 py-3.5 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors shadow-lg">
              Get Free Quote
            </Link>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#25D366]/90 transition-colors shadow-lg">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
