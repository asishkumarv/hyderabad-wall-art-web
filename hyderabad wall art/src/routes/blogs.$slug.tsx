import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { renderRichText, formatDisplayDate } from "@/lib/rich-text";

export const Route = createFileRoute("/blogs/$slug")({
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const { slug } = Route.useParams();
  const { blogPosts: apiBlogs, isLoading } = useStore();



  if (isLoading) return <div className="py-40 text-center">Loading blog post...</div>;

  const blog = apiBlogs.find((b: any) => b.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground">Blog Not Found</h1>
          <p className="mt-4 text-muted-foreground">The blog post you're looking for doesn't exist.</p>
          <Link to="/blogs" className="mt-6 inline-block px-6 py-3 gradient-primary text-white rounded-lg font-semibold">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = (blog.gallery_images && blog.gallery_images.length > 0) 
    ? blog.gallery_images 
    : [blog.image];

  const rows: { images: { url: string; index: number }[]; height: number }[] = [];
  let currentRow: { url: string; index: number }[] = [];
  let currentAspectRatioSum = 0;
  
  const targetHeight = window.innerWidth < 640 ? 140 : window.innerWidth < 768 ? 180 : 220;
  const gap = 16; // gap-4 is 16px

  galleryImages.forEach((img, i) => {
    let initialRatio = 1.5;
    if (img.toLowerCase().includes("woodcarved") || img.toLowerCase().includes("staircase") || img.toLowerCase().includes("stencil") || img.toLowerCase().includes("portrait") || img.toLowerCase().includes("potrait") || img.toLowerCase().includes("swami") || img.toLowerCase().includes("krishna")) {
      initialRatio = 0.67;
    }
    const ratio = aspectRatios[img] || initialRatio;
    currentRow.push({ url: img, index: i });
    currentAspectRatioSum += ratio;

    const rowWidth = currentAspectRatioSum * targetHeight + (currentRow.length - 1) * gap;
    if (rowWidth >= containerWidth) {
      let exactHeight = (containerWidth - (currentRow.length - 1) * gap) / currentAspectRatioSum;
      if (exactHeight > targetHeight * 1.35) {
        exactHeight = targetHeight;
      }
      rows.push({ images: currentRow, height: exactHeight });
      currentRow = [];
      currentAspectRatioSum = 0;
    }
  });

  if (currentRow.length > 0) {
    rows.push({ images: currentRow, height: targetHeight });
  }

  return (
    <div>
      {/* Banner */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/70 to-navy/40" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/blogs" className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to Blogs
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">{blog.category}</span>
              <span className="text-white/60 text-sm">{blog.createdAt ? formatDisplayDate(blog.createdAt) : "Recently Published"}</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">{blog.title}</h1>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderRichText(blog.content)}
        </div>
      </section>

      {/* Related Media */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-10">Related Wall Art Visuals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-[1.5rem] aspect-square bg-card border border-gold/10 hover:border-gold/30 transition-all duration-300 shadow-md hover:shadow-gold/10"
              >
                <img
                  src={img}
                  alt={`${blog.title} related work ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white">Get Free Consultation</h2>
          <p className="mt-3 text-white/80">Inspired by what you read? Let us bring your wall art vision to life.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="px-8 py-3.5 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors shadow-lg">Contact Us</Link>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#25D366]/90 transition-colors shadow-lg">WhatsApp Us</a>
          </div>
        </div>
      </section>
    </div>
  );
}
