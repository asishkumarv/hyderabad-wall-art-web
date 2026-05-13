import { motion } from "framer-motion";

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  center?: boolean;
  light?: boolean;
}

export default function SectionHeading({ subtitle, title, description, center = true, light = false }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${center ? "text-center" : ""}`}
    >
      {subtitle && (
        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 ${
          light ? "bg-gold/20 text-gold" : "bg-primary/10 text-primary"
        }`}>
          {subtitle}
        </span>
      )}
      <h2 className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold ${
        light ? "text-white" : "text-foreground"
      }`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 max-w-2xl text-lg ${center ? "mx-auto" : ""} ${
          light ? "text-white/70" : "text-muted-foreground"
        }`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
