import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@/assets/logo.jpg";
import { useStore } from "@/lib/store";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Videos", to: "/videos" },
  { label: "Wallpaper Services", to: "/services/wallpaper" },
  { label: "Wall Art Services", to: "/wall-art-services", hasDropdown: true },
  { label: "Blogs", to: "/blogs" },
  { label: "Contact Us", to: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { services } = useStore();
  const location = useLocation();

  const wallArtServices = useMemo(() => {
    const categories: Record<string, any[]> = {
      "Commercial Wall Art": [],
      "Home Wall Art": [],
      "Specialty Art": [],
    };

    services.forEach(service => {
      if (service.key === "wallpaper") return;
      
      let to = `/wall-art-services/${service.key}`;
      if (service.key === "home") {
        to = "/wall-art-services/home/living-room";
      } else if (service.key === "commercial") {
        to = "/wall-art-services/commercial/hotels-restaurants";
      } else if (service.key === "mural") {
        to = "/wall-art-services/mural-paintings";
      } else if (service.key === "stencil") {
        to = "/wall-art-services/stencil-wall-painting";
      } else if (
        service.key === "service-1778664020938" ||
        service.key.includes("wood-carving") ||
        service.label.toLowerCase().includes("wood carving")
      ) {
        to = "/wall-art-services/wood-carved-wall-art";
      }

      const item = { label: service.label, to };
      
      if (service.category?.toLowerCase().includes("commercial")) {
        categories["Commercial Wall Art"].push(item);
      } else if (service.category?.toLowerCase().includes("home") || service.category?.toLowerCase().includes("residential")) {
        categories["Home Wall Art"].push(item);
      } else {
        categories["Specialty Art"].push(item);
      }
    });

    // Remove empty categories
    return Object.fromEntries(Object.entries(categories).filter(([_, items]) => items.length > 0));
  }, [services]);

  useEffect(() => {
    setMobileOpen(false);
    setDesktopServicesOpen(false);
    setMobileServicesOpen(false);
    setActiveCategory(null);
  }, [location.pathname]);

  useEffect(() => {
    const { body, documentElement } = document;

    if (!mobileOpen) {
      body.style.overflow = "";
      documentElement.style.overflow = "";
      return;
    }

    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.overflow = "";
      documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between md:h-20">
            <Link to="/" className="flex min-w-0 items-center gap-2">
              <img src={logoImg} alt="Hyderabad Wall Arts" className="h-12 w-auto rounded-lg" />
              <div className="min-w-0 flex flex-col">
                <span className="block truncate font-heading text-base font-bold leading-none text-primary sm:text-lg sm:leading-tight">Hyderabad</span>
                <span className="block truncate font-heading text-[10px] uppercase tracking-wider text-gold sm:text-xs">Wall Arts</span>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setDesktopServicesOpen(true)}
                    onMouseLeave={() => {
                      setDesktopServicesOpen(false);
                      setActiveCategory(null);
                    }}
                  >
                    <Link
                      to="/wall-art-services"
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                      <svg className={`h-4 w-4 transition-transform ${desktopServicesOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                    <AnimatePresence>
                      {desktopServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full w-[460px] overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 z-50"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Wall Art Categories</span>
                            <Link
                              to="/wall-art-services"
                              className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                            >
                              View All Services
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                          <div className="h-px bg-border/60" />
                          <div className="grid grid-cols-2 gap-6">
                            {Object.entries(wallArtServices).map(([category, items]) => (
                              <div key={category} className="space-y-3">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-gold border-b border-border/40 pb-1">{category}</p>
                                <div className="space-y-1">
                                  {items.map((item) => (
                                    <Link
                                      key={item.to}
                                      to={item.to}
                                      className="block rounded-lg px-2 py-1.5 text-sm text-foreground transition-all duration-200 hover:bg-accent hover:text-primary hover:translate-x-1"
                                    >
                                      {item.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      location.pathname === link.to ? "bg-accent text-primary" : "text-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>

            <Link to="/contact" className="hidden items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90 lg:inline-flex gradient-primary">
              Get Quote
            </Link>

            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="relative z-[70] p-2 text-foreground lg:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close mobile menu overlay"
            className="fixed inset-0 top-16 z-40 bg-foreground/20 lg:hidden md:top-20"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 top-16 z-[45] border-t border-border bg-card lg:hidden md:top-20">
            <div className="flex h-full flex-col overflow-hidden">
              <div className="h-full overflow-y-auto overscroll-contain px-4 py-4">
                <div className="space-y-1 pb-6">
                  {navLinks.map((link) =>
                    link.hasDropdown ? (
                      <div key={link.label} className="overflow-hidden rounded-lg border border-border/60 bg-secondary/30">
                        <button
                          type="button"
                          onClick={() => setMobileServicesOpen((prev) => !prev)}
                          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground"
                        >
                          {link.label}
                          <svg className={`h-4 w-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {mobileServicesOpen && (
                          <div className="max-h-[calc(100vh-16rem)] overflow-y-auto overscroll-contain border-t border-border/60 scroll-smooth">
                            <Link
                              to="/wall-art-services"
                              className="block px-4 py-3 text-sm font-semibold text-primary"
                              onClick={() => setMobileOpen(false)}
                            >
                              View All Services
                            </Link>
                            {Object.entries(wallArtServices).map(([category, items]) => (
                              <div key={category}>
                                <p className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary">{category}</p>
                                {items.map((item) => (
                                  <Link
                                    key={item.to}
                                    to={item.to}
                                    className="block px-6 py-2 text-sm text-foreground transition-colors hover:text-primary"
                                    onClick={() => setMobileOpen(false)}
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        key={link.label}
                        to={link.to}
                        className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-primary"
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ),
                  )}
                  <Link
                    to="/contact"
                    className="mx-4 mt-4 block rounded-lg px-5 py-3 text-center text-sm font-semibold text-primary-foreground gradient-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
