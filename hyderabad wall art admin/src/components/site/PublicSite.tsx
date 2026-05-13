import { motion } from "framer-motion";
import { ArrowRight, Instagram, MapPin, MessageCircle, PaintBucket, Play, Sparkles, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStore, type ServiceKey } from "@/lib/store";

const serviceOrder: ServiceKey[] = ["home", "commercial", "mural", "stencil"];
const serviceRouteMap: Record<string, ServiceKey> = {
  "/": "home",
  "/home": "home",
  "/commercial": "commercial",
  "/mural": "mural",
  "/stencil": "stencil",
};

function cleanWhatsappNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function PublicSite() {
  const location = useLocation();
  const { services, gallery, blogPosts, settings, categories, videos, testimonials, pages } = useStore();
  const [activeWallpaperFilter, setActiveWallpaperFilter] = useState("All");
  const selectedServiceKey = serviceRouteMap[location.pathname] ?? "home";
  const activeServices = serviceOrder
    .map((key) => services.find((service) => service.key === key))
    .filter((service): service is NonNullable<typeof service> => Boolean(service && service.isActive));
  const selectedService = services.find((service) => service.key === selectedServiceKey) ?? activeServices[0] ?? services[0];
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber(settings.whatsappNumber)}`;
  const galleryCategories = ["All", ...new Set(gallery.map((image) => image.category))];
  const wallpaperFilters = ["All", ...categories.map((category) => category.name)];
  const filteredWallpaperCategories = activeWallpaperFilter === "All"
    ? categories
    : categories.filter((category) => category.name === activeWallpaperFilter);
  const heroTitle = selectedServiceKey === "home" ? pages.home.heroTitle || selectedService.heroTitle : selectedService.heroTitle;
  const heroImage = selectedServiceKey === "home"
    ? pages.home.heroImages[0] || selectedService.images[0] || "/hwa-wall-bg.jpg"
    : selectedService.images[0] || "/hwa-wall-bg.jpg";
  const visibleVideos = useMemo(
    () => videos.slice(0, 3),
    [videos],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <BrandLogo size={48} src={settings.logo || undefined} alt={settings.siteName} />
            <div>
                <p className="text-lg font-semibold tracking-tight">{settings.siteName}</p>
              <p className="text-sm text-muted-foreground">Luxury murals & textured wall finishes</p>
            </div>
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            {activeServices.map((service) => (
              <Button key={service.key} asChild variant={selectedService.key === service.key ? "luxury" : "ghost"} size="sm">
                <Link to={service.key === "home" ? "/" : `/${service.key}`}>{service.label}</Link>
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="glass" size="sm">
              <a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border/70">
          <div className="absolute inset-0 bg-hero-radiance opacity-90" />
          <div className="absolute inset-0 bg-grid-luxury opacity-50" />
          <div className="container relative grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
              <Badge variant="secondary" className="rounded-full border-primary/20 bg-primary/10 px-4 py-1 text-sm text-primary">Hyderabad’s premium wall art studio</Badge>
              <div className="space-y-5">
                <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">{heroTitle}</h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">{selectedService.heroSubtitle}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="luxury" size="lg"><a href={whatsappUrl} target="_blank" rel="noreferrer">Book a consultation <ArrowRight className="h-4 w-4" /></a></Button>
                <Button asChild variant="glass" size="lg"><a href="#gallery">View gallery</a></Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[{ label: "Custom projects", value: "120+" }, { label: "Hyderabad areas served", value: "18" }, { label: "Avg. concept turnaround", value: "48 hrs" }].map((item) => (
                  <Card key={item.label} className="panel-luxury panel-hover"><CardContent className="space-y-2 p-5"><p className="text-2xl font-semibold tracking-tight">{item.value}</p><p className="text-sm text-muted-foreground">{item.label}</p></CardContent></Card>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative">
              <div className="pointer-events-none absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border border-primary/15 bg-primary/10 blur-2xl" />
              <div className="signature-tilt relative overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-elevated">
                <img src={heroImage} alt={`${selectedService.label} wall art showcase in Hyderabad`} className="aspect-[4/5] h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <Card className="panel-luxury backdrop-blur-xl"><CardContent className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-end"><div><p className="text-sm text-muted-foreground">Currently highlighted</p><p className="mt-1 text-2xl font-semibold tracking-tight">{selectedService.label}</p></div><div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary" /> Hyderabad, Telangana</div></CardContent></Card>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-b border-border/70 py-16">
          <div className="container space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4"><div className="space-y-2"><p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Live service sync</p><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Visible categories controlled by the admin dashboard</h2></div><p className="max-w-2xl text-sm leading-7 text-muted-foreground">Hero copy, selling points, and service visibility update in real time from the management layer.</p></div>
            <div className="grid gap-4 lg:grid-cols-4">{serviceOrder.map((key) => { const service = services.find((entry) => entry.key === key); if (!service) return null; return <Card key={service.key} className={`panel-luxury ${service.isActive ? "panel-hover" : "opacity-60"}`}><CardContent className="space-y-4 p-5"><div className="flex items-center justify-between"><Badge variant={service.isActive ? "default" : "outline"}>{service.isActive ? "Visible" : "Hidden"}</Badge><PaintBucket className="h-4 w-4 text-primary" /></div><div><p className="text-xl font-semibold tracking-tight">{service.label}</p><p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{service.category} · {service.subcategory}</p><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{service.heroSubtitle}</p></div>{service.isActive ? <Button asChild variant="outline" size="sm"><Link to={service.key === "home" ? "/" : `/${service.key}`}>Open live page</Link></Button> : <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Temporarily hidden on frontend</p>}</CardContent></Card>; })}</div>
          </div>
        </section>

        {selectedServiceKey === "home" && (
          <>
            <section className="border-b border-border/70 py-16">
              <div className="container space-y-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="space-y-2"><p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Wallpaper categories</p><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Categories managed from admin</h2></div>
                  <div className="flex flex-wrap gap-2">
                    {wallpaperFilters.map((filter) => (
                      <Button key={filter} variant={activeWallpaperFilter === filter ? "outline" : "ghost"} size="sm" onClick={() => setActiveWallpaperFilter(filter)}>
                        {filter}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {filteredWallpaperCategories.map((category) => (
                    <Card key={category.id} className="panel-luxury panel-hover overflow-hidden">
                      <div className="aspect-[4/3] overflow-hidden"><img src={category.image} alt={category.name} loading="lazy" className="h-full w-full object-cover" /></div>
                      <CardContent className="space-y-3 p-5"><div className="flex items-center justify-between gap-3"><p className="text-lg font-semibold tracking-tight">{category.name}</p><Badge variant="secondary">Wallpaper</Badge></div><p className="text-sm leading-6 text-muted-foreground">{category.description}</p></CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            <section className="border-b border-border/70 py-16">
              <div className="container space-y-8">
                <div className="space-y-2"><p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Videos</p><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Recent wall art walkthroughs</h2></div>
                <div className="grid gap-5 lg:grid-cols-3">
                  {visibleVideos.map((video) => (
                    <Card key={video.id} className="panel-luxury panel-hover overflow-hidden">
                      <button type="button" onClick={() => window.open(video.videoUrl, "_blank", "noopener,noreferrer")} className="group block w-full text-left">
                        <div className="relative aspect-video overflow-hidden">
                          <img src={video.thumbnail} alt={video.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                          <div className="absolute inset-0 bg-background/20" />
                          <div className="absolute inset-0 flex items-center justify-center"><span className="flex h-14 w-14 items-center justify-center rounded-full border border-border/70 bg-card/80 backdrop-blur"><Play className="h-5 w-5 text-primary" /></span></div>
                        </div>
                        <CardContent className="space-y-2 p-5"><div className="flex items-center justify-between gap-3"><p className="font-semibold tracking-tight">{video.title}</p><Badge variant="outline">{video.category}</Badge></div><p className="text-sm text-muted-foreground">Open video</p></CardContent>
                      </button>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        <section className="border-b border-border/70 py-16">
          <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <Card className="panel-luxury h-fit"><CardContent className="space-y-6 p-6"><div><p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Why choose us</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">{selectedService.label} expertise, tuned by live admin copy</h2></div><div className="space-y-4">{selectedService.whyChooseUs.map((point, index) => <div key={`${point}-${index}`} className="flex gap-3"><div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary"><Star className="h-4 w-4" /></div><p className="text-sm leading-7 text-muted-foreground">{point}</p></div>)}</div></CardContent></Card>
            <div className="grid gap-4 sm:grid-cols-2">{gallery.slice(0, 4).map((image) => <Card key={image.id} className="panel-luxury panel-hover overflow-hidden"><div className="aspect-[4/3] overflow-hidden"><img src={image.imageUrl} alt={image.altText} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]" /></div><CardContent className="space-y-2 p-5"><div className="flex items-center justify-between gap-2"><p className="font-medium tracking-tight">{image.title}</p><Badge variant="outline">{image.category}</Badge></div><p className="text-sm text-muted-foreground">{image.altText}</p></CardContent></Card>)}</div>
          </div>
        </section>

        <section id="gallery" className="border-b border-border/70 py-16">
          <div className="container space-y-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Gallery dynamic hub</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">SEO-ready images filtered by category</h2></div><div className="flex flex-wrap gap-2">{galleryCategories.map((category) => <Badge key={category} variant="outline" className="rounded-full px-4 py-2 text-sm">{category}</Badge>)}</div></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{gallery.slice(0, 6).map((image) => <Card key={image.id} className="panel-luxury panel-hover overflow-hidden"><div className="aspect-[5/4] overflow-hidden"><img src={image.imageUrl} alt={image.altText} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" /></div><CardContent className="space-y-3 p-5"><div className="flex items-center justify-between gap-3"><p className="text-lg font-semibold tracking-tight">{image.title}</p><Badge variant="secondary">{image.category}</Badge></div><p className="text-sm leading-6 text-muted-foreground">{image.altText}</p></CardContent></Card>)}</div></div>
        </section>

        <section className="border-b border-border/70 py-16">
          <div className="container space-y-8"><div className="space-y-2"><p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">From the blog</p><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Content managed from the rich text admin writer</h2></div><div className="grid gap-5 lg:grid-cols-2">{blogPosts.slice(0, 2).map((post) => <Card key={post.id} className="panel-luxury panel-hover overflow-hidden"><div className="aspect-[16/9] overflow-hidden"><img src={post.image || "/hwa-wall-bg.jpg"} alt={post.title} loading="lazy" className="h-full w-full object-cover" /></div><CardContent className="space-y-4 p-6"><div className="flex items-center justify-between gap-3"><Badge variant="secondary">{post.category}</Badge><Sparkles className="h-4 w-4 text-primary" /></div><div><h3 className="text-2xl font-semibold tracking-tight">{post.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{post.excerpt}</p></div><Button asChild variant="outline" size="sm"><Link to={`/blogs/${post.slug}`}>Read More</Link></Button></CardContent></Card>)}</div></div>
        </section>

        {selectedServiceKey === "home" && testimonials.length ? (
          <section className="border-b border-border/70 py-16">
            <div className="container space-y-8">
              <div className="space-y-2"><p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Testimonials</p><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Client feedback managed from admin</h2></div>
              <div className="grid gap-5 lg:grid-cols-3">{testimonials.slice(0, 3).map((testimonial) => <Card key={testimonial.id} className="panel-luxury panel-hover"><CardContent className="space-y-4 p-6"><div className="flex items-center gap-3">{testimonial.image ? <img src={testimonial.image} alt={testimonial.name} className="h-12 w-12 rounded-full object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-canvas-texture text-sm font-semibold">{testimonial.initials}</div>}<div><p className="font-semibold tracking-tight">{testimonial.name}</p><div className="mt-1 flex items-center gap-1">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-4 w-4 ${index < testimonial.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />)}</div></div></div><p className="text-sm leading-7 text-muted-foreground">“{testimonial.message}”</p></CardContent></Card>)}</div>
            </div>
          </section>
        ) : null}

        <section className="py-16"><div className="container"><Card className="panel-luxury overflow-hidden"><CardContent className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10"><div className="space-y-4"><p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Site identity sync</p><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Every CTA now pulls from global settings</h2><p className="max-w-2xl text-sm leading-7 text-muted-foreground">Update the WhatsApp number, Instagram profile, or Hyderabad office address once in the admin dashboard and it reflects site-wide.</p><div className="flex flex-wrap gap-3"><Button asChild variant="luxury" size="lg"><a href={whatsappUrl} target="_blank" rel="noreferrer">Start on WhatsApp <MessageCircle className="h-4 w-4" /></a></Button><Button asChild variant="glass" size="lg"><a href={settings.instagramUrl} target="_blank" rel="noreferrer"><Instagram className="h-4 w-4" /> Instagram</a></Button></div></div><div className="grid gap-4"><Card className="panel-luxury bg-canvas-texture"><CardContent className="space-y-2 p-5"><p className="text-sm text-muted-foreground">WhatsApp</p><p className="text-xl font-semibold tracking-tight">{settings.whatsappNumber}</p></CardContent></Card><Card className="panel-luxury bg-canvas-texture"><CardContent className="space-y-2 p-5"><p className="text-sm text-muted-foreground">Instagram</p><p className="text-base font-medium tracking-tight">{settings.instagramUrl}</p></CardContent></Card><Card className="panel-luxury bg-canvas-texture"><CardContent className="space-y-2 p-5"><p className="text-sm text-muted-foreground">Office address</p><p className="text-base font-medium tracking-tight">{settings.officeAddress}</p><p className="text-xs text-muted-foreground">{settings.footer}</p></CardContent></Card></div></CardContent></Card></div></section>
      </main>
    </div>
  );
}
