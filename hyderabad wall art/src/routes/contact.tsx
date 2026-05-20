import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Hyderabad Wall Arts" },
      { name: "description", content: "Get in touch with Hyderabad Wall Arts for a free consultation on your wall art project." },
      { property: "og:title", content: "Contact Us — Hyderabad Wall Arts" },
      { property: "og:description", content: "Get a free consultation for your wall art project." },
    ],
  }),
  component: ContactPage,
});

const HWA_DEFAULT_MAP_EMBED =
  "https://maps.app.goo.gl/okdzxvqdc1Je66Kw6";

function getMapEmbedUrl(value: string) {
  if (!value) {
    return HWA_DEFAULT_MAP_EMBED;
  }

  // 1. If it's a full iframe HTML tag, extract the src
  if (value.includes("<iframe")) {
    const srcMatch = value.match(/src="([^"]+)"/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }

  // 2. If it's already an embed URL, return it
  if (value.includes("output=embed") || value.includes("/maps/embed") || value.includes("pb=")) {
    return value;
  }

  // 3. If it's a standard share / place URL, extract coordinates or place name
  const placeMatch = value.match(/\/maps\/place\/([^/]+)/);
  const coordMatch = value.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

  if (placeMatch && coordMatch) {
    return `https://maps.google.com/maps?q=${placeMatch[1]}&ll=${coordMatch[1]},${coordMatch[2]}&z=17&output=embed`;
  }

  if (placeMatch) {
    return `https://maps.google.com/maps?q=${placeMatch[1]}&z=17&output=embed`;
  }

  if (coordMatch) {
    return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&ll=${coordMatch[1]},${coordMatch[2]}&z=17&output=embed`;
  }

  // 4. Default fallback: wrap search query
  return `https://maps.google.com/maps?q=${encodeURIComponent(value)}&z=17&output=embed`;
}

function ContactPage() {
  const { pages, settings, submitContact, isLoading } = useStore();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  const { contact } = pages;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service_requested: formData.service,
        message: formData.message,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-60 h-60 rounded-full bg-primary blur-[80px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-sm font-semibold tracking-wider uppercase mb-4">Get In Touch</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">Contact Us</h1>
            <p className="mt-4 text-white/70 text-lg">Get a free consultation for your wall art project</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {submitted ? (
                <div className="bg-card rounded-2xl p-10 border border-border text-center shadow-lg">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground">Thank You!</h3>
                  <p className="mt-2 text-muted-foreground">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border space-y-5 shadow-lg">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Send Us a Message</h2>
                  {[
                    { label: "Name", key: "name", type: "text", placeholder: "Your name" },
                    { label: "Email", key: "email", type: "email", placeholder: "your@email.com" },
                    { label: "Phone", key: "phone", type: "tel", placeholder: "+91 98765 43210" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        required
                        value={(formData as Record<string, string>)[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Service</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a service</option>
                      <option>Commercial Wall Art</option>
                      <option>Home Wall Art</option>
                      <option>Mural Paintings</option>
                      <option>Stencil Wall Painting</option>
                      <option>Wood Carved Wall Art</option>
                      <option>Wallpaper Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your project..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-3.5 gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-4">Get In Touch</h3>
                <div className="space-y-4">
                  {[
                    { icon: "📍", label: "Address", value: contact.address || "Hyderabad, Telangana, India" },
                    { icon: "📞", label: "Phone", value: contact.phone || "+91 98765 43210" },
                    { icon: "📧", label: "Email", value: contact.email || "info@hyderabadwallarts.com" },
                    { icon: "⏰", label: "Working Hours", value: contact.workingHours || "Mon - Sat: 9:00 AM - 7:00 PM" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">{item.label}</p>
                        <p className="text-muted-foreground text-sm">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Quick Connect */}
              <a
                href={`https://wa.me/918121341742`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground">WhatsApp Quick Connect</p>
                  <p className="text-sm text-muted-foreground">Chat with us instantly on WhatsApp</p>
                </div>
              </a>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-border h-64 bg-muted">
                <iframe
                  src={getMapEmbedUrl(contact.mapEmbed)}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hyderabad location"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
