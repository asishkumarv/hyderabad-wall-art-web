import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import livingRoomImg from "@/assets/service-living-room.jpg";
import threeDImg from "@/assets/service-3d-painting.jpg";
import muralImg from "@/assets/service-mural.jpg";
import hotelImg from "@/assets/service-hotel.jpg";
import kidsRoomImg from "@/assets/service-kids-room.jpg";
import stencilImg from "@/assets/service-stencil.jpg";
import downloadImg from "@/assets/download.jpg";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/blogs/")({
  head: () => ({
    meta: [
      { title: "Blogs — Hyderabad Wall Arts" },
      { name: "description", content: "Read our latest articles on wall art trends, tips, and inspiration." },
      { property: "og:title", content: "Blogs — Hyderabad Wall Arts" },
      { property: "og:description", content: "Wall art trends, tips, and inspiration." },
    ],
  }),
  component: BlogsPage,
});


function BlogsPage() {
  const { blogPosts: apiBlogs, isLoading } = useStore();

  if (isLoading) return <div className="py-40 text-center">Loading blogs...</div>;

  const blogs = apiBlogs.length > 0 
    ? apiBlogs.map((b: any) => ({
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        date: new Date(b.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        category: b.category,
        image: b.image || livingRoomImg
      }))
    : [
        { slug: "living-room-wall-art-ideas", title: "Top Living Room Wall Art Ideas for Modern Homes", excerpt: "Discover the latest trends in wall art that are transforming living rooms into stunning spaces...", date: "Apr 15, 2026", category: "Trends", image: livingRoomImg },
        { slug: "how-to-choose-wall-art", title: "How to Choose the Right Wall Art for Your Space", excerpt: "A comprehensive guide to selecting wall art that complements your interior decor...", date: "Apr 10, 2026", category: "Tips", image: muralImg },
      ];

  return (
    <div>
      <section 
        className="relative py-20 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${downloadImg})` }}
      >
        <div className="absolute inset-0 bg-navy/80" />
        <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-sm font-semibold tracking-wider uppercase mb-4">Our Blogs</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">Wall Art Insights</h1>
            <p className="mt-4 text-white/70 text-lg">Tips, trends, and inspiration for wall art</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, i) => (
              <motion.article
                key={blog.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all group"
              >
                <Link to="/blogs/$slug" params={{ slug: blog.slug }} className="block">
                  <div className="aspect-video overflow-hidden relative">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <h3 className="font-heading font-bold text-white text-lg">{blog.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">{blog.category}</span>
                      <span className="text-xs text-muted-foreground">{blog.date}</span>
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{blog.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{blog.excerpt}</p>
                    <span className="inline-block mt-4 text-sm font-semibold text-primary hover:text-gold transition-colors">
                      Read More →
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
