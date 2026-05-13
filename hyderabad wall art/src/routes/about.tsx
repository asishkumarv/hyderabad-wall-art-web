import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useStore } from "@/lib/store";

import vijayImg from "@/assets/vijay-bhaskar.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Hyderabad Wall Arts" },
      { name: "description", content: "Learn about Hyderabad Wall Art's 20+ years journey of transforming walls across Hyderabad." },
      { property: "og:title", content: "About Us — Hyderabad Wall Arts" },
      { property: "og:description", content: "Learn about Hyderabad Wall Art's 20+ years journey." },
    ],
  }),
  component: AboutPage,
});

const expertise = [
  { name: "Tribal Art", pct: 95 },
  { name: "3D Paintings", pct: 61 },
  { name: "Wall Murals", pct: 85 },
  { name: "Abstract Art", pct: 77 },
  { name: "Wall Sculpture", pct: 77 },
  { name: "Portrait", pct: 77 },
];

function AboutPage() {
  const { pages, isLoading } = useStore();

  if (isLoading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  const { about } = pages;

  return (
    <div>
      {/* Hero */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-primary blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-gold blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-sm font-semibold tracking-wider uppercase mb-4">Who We Are</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white">{about.title || "About Us"}</h1>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {about.content || "As the name suggests, Hyderabad Wall Art is a wall art painting business based in Hyderabad. Our goal is to \"bring life\" to every wall in Hyderabad through wall art. We have been in business for more than two decades and have done a lot of work, including Commercial Projects, Home Interior Decoration, Public Art, and Indoor Murals."}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading subtitle="Our Skills" title="Our Expertise" />
          <div className="space-y-6">
            {expertise.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-foreground">{skill.name}</span>
                  <span className="font-semibold text-primary">{skill.pct}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full gradient-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-60 h-60 rounded-full bg-gold blur-[80px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img src={about.founderImage || vijayImg} alt={about.founderName || "Vijay Bhaskar"} className="w-full h-auto object-cover" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/90 to-transparent p-6">
                  <h3 className="font-heading text-2xl font-bold text-white">{about.founderName || "Vijay Bhaskar"}</h3>
                  <p className="text-gold font-semibold">Managing Director</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-sm font-semibold tracking-wider uppercase mb-4">Founder's Message</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">{about.founderName || "Vijay Bhaskar (M.D)"}</h2>
              <div className="space-y-4 text-white/80 leading-relaxed whitespace-pre-line">
                {about.founderDescription || "I started Hyderabad Wall Art Business with a motive to make wall art easily accessible to everyone who desires to enhance the look of their home."}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
