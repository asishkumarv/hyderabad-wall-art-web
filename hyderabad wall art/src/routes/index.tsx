import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useStore, type GalleryImage } from "@/lib/store";

import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import livingRoomImg from "@/assets/service-living-room.jpg";
import kidsRoomImg from "@/assets/service-kids-room.jpg";
import threeDImg from "@/assets/service-3d-painting.jpg";
import hotelImg from "@/assets/service-hotel.jpg";
import officeImg from "@/assets/service-office.jpg";
import staircaseImg from "@/assets/service-staircase.jpg";
import schoolImg from "@/assets/service-school.jpg";
import bedroomImg from "@/assets/service-bedroom.jpg";
import muralImg from "@/assets/service-mural.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hyderabad Wall Arts — Premium Wall Art & Painting Services" },
      { name: "description", content: "Transform your spaces with Hyderabad Wall Arts. Expert mural paintings, 3D art, commercial and home wall art services since 2000." },
      { property: "og:title", content: "Hyderabad Wall Arts — Premium Wall Art Services" },
      { property: "og:description", content: "Transform your spaces with Hyderabad Wall Arts. Expert wall art services since 2000." },
    ],
  }),
  component: Index,
});

function getInitialAspectRatio(title: string) {
  const t = title.toLowerCase();
  if (
    t.includes("carving") ||
    t.includes("bala") ||
    t.includes("krishna") ||
    t.includes("lalla") ||
    t.includes("swami") ||
    t.includes("rama") ||
    t.includes("lord") ||
    t.includes("portrait") ||
    t.includes("potrait") ||
    t.includes("horses") ||
    t.includes("hourse") ||
    t.includes("flute")
  ) {
    return 0.67; // Portrait
  }
  return 1.5; // Landscape
}

function Index() {
  const { services: apiServices, gallerySections, gallery, testimonials: apiTestimonials, pages, isLoading } = useStore();
  const [aspectRatios, setAspectRatios] = useState<Record<string, number>>({});
  const [containerWidth, setContainerWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => {
      const padding = window.innerWidth < 640 ? 32 : window.innerWidth < 1024 ? 48 : 64;
      setContainerWidth(Math.min(1216, window.innerWidth - padding));
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fallbacks if DB is empty
  const heroSlides = (pages.home.heroSlides && pages.home.heroSlides.length > 0)
    ? pages.home.heroSlides.map(slide => ({ 
        image: slide.image, 
        heading: slide.title || "Artistic Excellence", 
        sub: slide.subtitle || "Since 2000" 
      }))
    : [
        { image: heroSlide1, heading: "Transform Your Walls\nInto Masterpieces", sub: "Premium wall art for homes, hotels & commercial spaces" },
        { image: heroSlide2, heading: "Luxury Wall Art\nFor Every Space", sub: "Hotels, restaurants & office interiors transformed" },
        { image: heroSlide3, heading: "Artistic Excellence\nSince 2000", sub: "20+ years of creating stunning wall art across Hyderabad" },
      ];

  const displayServices = apiServices.length > 0 
    ? apiServices.filter(s => s.isActive).map(s => {
        let to = `/wall-art-services/${s.key}`;
        let params: any = undefined;

        if (s.key === "home") to = "/wall-art-services/home/living-room";
        else if (s.key === "commercial") to = "/wall-art-services/commercial/hotels-restaurants";
        else if (s.key === "mural") to = "/wall-art-services/mural-paintings";
        else if (s.key === "stencil") to = "/wall-art-services/stencil-wall-painting";
        else {
          to = "/wall-art-services/$serviceKey";
          params = { serviceKey: s.key };
        }
        
        return {
          title: s.label,
          desc: s.heroSubtitle,
          image: s.images?.[0] || livingRoomImg,
          to: to as any,
          params
        };
      })
    : [
        { title: "Living Room", desc: "Premium abstract & modern art", image: livingRoomImg, to: "/wall-art-services/home/living-room", params: undefined },
        { title: "Kids Room", desc: "Fun cartoon themes", image: kidsRoomImg, to: "/wall-art-services/home/kids-room", params: undefined },
        { title: "3D Painting", desc: "Depth illusion art", image: threeDImg, to: "/wall-art-services/home/3d-painting", params: undefined },
        { title: "Hotels & Restaurants", desc: "Themed ambience murals", image: hotelImg, to: "/wall-art-services/commercial/hotels-restaurants", params: undefined },
        { title: "Shops & Offices", desc: "Modern branding art", image: officeImg, to: "/wall-art-services/commercial/shops-offices", params: undefined },
        { title: "Staircase Wall", desc: "Vertical storytelling art", image: staircaseImg, to: "/wall-art-services/home/staircase", params: undefined },
        { title: "School Cartoon", desc: "Educational murals", image: schoolImg, to: "/wall-art-services/commercial/school-cartoon", params: undefined },
        { title: "Master Bedroom", desc: "Calm elegant designs", image: bedroomImg, to: "/wall-art-services/home/master-bedroom", params: undefined },
      ];

  const reviews = apiTestimonials.length > 0
    ? apiTestimonials.map(t => ({ name: t.name, text: t.message, rating: t.rating, avatar: t.initials }))
    : [
        { name: "Rajesh Kumar", text: "Absolutely stunning work on our living room wall! The team was professional and delivered beyond expectations.", rating: 5, avatar: "RK" },
        { name: "Priya Sharma", text: "Got a beautiful 3D painting done for our hotel lobby. Guests always compliment it. Highly recommended!", rating: 5, avatar: "PS" },
        { name: "Anil Reddy", text: "The kids room painting was magical. My children love their new cartoon-themed room!", rating: 5, avatar: "AR" },
        { name: "Sunitha Devi", text: "Excellent mural work for our restaurant. The art perfectly captures our brand's essence.", rating: 5, avatar: "SD" },
        { name: "Karthik Rao", text: "Professional team, great communication, and outstanding quality. Will definitely work with them again.", rating: 5, avatar: "KR" },
      ];

  const offerImages = [livingRoomImg, hotelImg, muralImg, threeDImg];

  useEffect(() => {
    setCurrentSlide(0);
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % (heroSlides.length || 1)), 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);
  const [currentOfferImg, setCurrentOfferImg] = useState(0);
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    setCurrentReview(0);
    const timer = setInterval(() => setCurrentReview((p) => (p + 1) % (reviews.length || 1)), 4000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  useEffect(() => {
    setCurrentOfferImg(0);
    const timer = setInterval(() => setCurrentOfferImg((p) => (p + 1) % (offerImages.length || 1)), 3000);
    return () => clearInterval(timer);
  }, [offerImages.length]);

  const activeSections = gallerySections
    .filter((s) => s.isActive)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  if (isLoading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  return (
    <div>
      {/* Hero Slider */}
      <section className="relative w-full aspect-[16/9] h-auto min-h-[250px] sm:aspect-auto sm:h-[60vh] sm:min-h-[450px] md:h-screen md:min-h-[600px] md:max-h-[900px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img src={heroSlides[currentSlide % heroSlides.length]?.image} alt="Wall art showcase" className="w-full h-full object-cover" width={1920} height={1080} />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-primary/30" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              key={`text-${currentSlide}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-2xl"
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-gold/20 text-gold text-[10px] sm:text-sm font-semibold tracking-wider uppercase mb-2 sm:mb-6 backdrop-blur-sm"
              >
                Since 2000 • Premium Wall Art
              </motion.span>
              <h1 className="font-heading text-2xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight sm:leading-tight whitespace-pre-line">
                {(heroSlides[currentSlide % heroSlides.length]?.heading || "").split("\n").map((line, i) => (
                  <span key={i}>
                    {i === 1 ? <span className="text-gold">{line}</span> : line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </h1>
              <p className="mt-2 sm:mt-6 text-xs sm:text-lg text-white/80 max-w-xl leading-relaxed">
                {heroSlides[currentSlide % heroSlides.length]?.sub}
              </p>
              <div className="mt-4 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
                <Link
                  to="/wall-art-services"
                  className="inline-flex items-center px-4 py-2.5 sm:px-8 sm:py-4 gradient-primary text-white rounded-lg font-semibold text-xs sm:text-base hover:opacity-90 transition-all shadow-lg hover:shadow-xl animate-pulse-glow"
                >
                  Explore Services
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-4 py-2.5 sm:px-8 sm:py-4 border-2 border-gold/50 text-white rounded-lg font-semibold text-xs sm:text-base hover:bg-gold/10 transition-all backdrop-blur-sm"
                >
                  Get Free Consultation
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-3 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${currentSlide === i ? "w-6 sm:w-10 bg-gold" : "w-1.5 sm:w-2 bg-white/40"}`}
            />
          ))}
        </div>
      </section>

      {/* Gallery Showcase */}
      {activeSections.length > 0 && (
        <section className="py-20 bg-secondary/35 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              subtitle="Gallery"
              title="Artwork Showcase"
              description="Explore our curated collection of custom wall art installations, murals, and professional paintings."
            />
            
            <div className="space-y-16 mt-12">
              {activeSections.map((section) => {
                const sectionImages = gallery
                  .filter(img => img.isActive && img.sectionId === section.id)
                  .sort((a, b) => a.orderIndex - b.orderIndex);
                  
                if (sectionImages.length === 0) return null;

                // Group images into justified rows
                const rows: { images: GalleryImage[]; height: number }[] = [];
                let currentRow: GalleryImage[] = [];
                let currentAspectRatioSum = 0;
                
                const targetHeight = window.innerWidth < 640 ? 180 : window.innerWidth < 768 ? 220 : window.innerWidth < 1024 ? 260 : 300;
                const gap = 24; // gap-6 is 24px

                sectionImages.forEach((image) => {
                  const ratio = aspectRatios[image.id] || getInitialAspectRatio(image.title);
                  currentRow.push(image);
                  currentAspectRatioSum += ratio;

                  const rowWidth = currentAspectRatioSum * targetHeight + (currentRow.length - 1) * gap;
                  if (rowWidth >= containerWidth) {
                    // Row is full, calculate exact height
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
                  <div key={section.id} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground tracking-wide">
                        {section.title}
                      </h3>
                      <div className="h-px bg-gold/30 flex-1" />
                    </div>
                    
                    <div className="space-y-6">
                      {rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex flex-wrap gap-6 justify-start">
                          {row.images.map((image) => {
                            const ratio = aspectRatios[image.id] || getInitialAspectRatio(image.title);
                            return (
                              <motion.div
                                key={image.id}
                                style={{
                                  height: `${row.height}px`,
                                  aspectRatio: `${ratio}`,
                                }}
                                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-card border border-gold/10 hover:border-gold/30 transition-all duration-300 shadow-md hover:shadow-gold/10 flex-none"
                                whileHover={{ y: -4 }}
                                onClick={() => setSelectedLightboxImage(image)}
                                layout
                              >
                                <img
                                  src={image.imageUrl}
                                  alt={image.altText || image.title}
                                  onLoad={(e) => {
                                    const img = e.currentTarget;
                                    if (img.naturalHeight > 0) {
                                      const loadedRatio = img.naturalWidth / img.naturalHeight;
                                      if (aspectRatios[image.id] !== loadedRatio) {
                                        setAspectRatios(prev => ({ ...prev, [image.id]: loadedRatio }));
                                      }
                                    }
                                  }}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                                  <h4 className="font-heading text-base font-bold text-white tracking-wide">{image.title}</h4>
                                  {image.altText && <p className="text-xs text-white/70 mt-1 line-clamp-2">{image.altText}</p>}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services Showcase */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Our Services"
            title="Wall Art Services"
            description="From living room, kids room, 3D Painting, Hotels & Restaurants and many more — we transform every space with art."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayServices.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Link to={service.to} params={service.params} className="group block">
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] shadow-lg">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      width={800}
                      height={600}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="px-6 py-2 rounded-full bg-gold text-gold-foreground font-semibold text-sm shadow-lg">
                        View Details
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="font-heading font-bold text-lg text-white">{service.title}</h3>
                      <p className="text-white/70 text-sm mt-1">{service.desc}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer - Visual Split */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-4">What We Offer</span>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {pages.about.title || "Premium Wall Art Services"}
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                {pages.about.content || "Our commercial painting services transform spaces to suit your purpose and add layers to their character. From living room, kids room, 3D Painting, Hotels & Restaurants and many more to even large office spaces – we undertake and ensure timely delivery of all our projects."}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {(pages.home.stats && pages.home.stats.length > 0 ? pages.home.stats : [
                  { num: "500+", label: "Projects Completed" },
                  { num: "20+", label: "Years Experience" },
                  { num: "200+", label: "Happy Clients" },
                  { num: "50+", label: "Expert Artists" },
                ]).map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl bg-card border border-border">
                    <p className="font-heading text-2xl font-bold text-primary">{stat.num}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentOfferImg}
                    src={offerImages[currentOfferImg]}
                    alt="Our wall art work"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </AnimatePresence>
              </div>
              <div className="absolute bottom-4 left-4 h-24 w-24 rounded-2xl gradient-primary flex items-center justify-center shadow-xl sm:bottom-6 sm:left-6 sm:h-32 sm:w-32">
                <div className="text-center text-white">
                  <p className="font-heading text-3xl font-bold">20+</p>
                  <p className="text-xs">Years</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Glassmorphism */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-gold blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Why Choose Us"
            title="Why Choose Hyderabad Wall Arts"
            description="We bring 20+ years of expertise, artistic excellence, and premium quality to every project."
            light
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(pages.home.whyChooseUs && pages.home.whyChooseUs.length > 0 ? pages.home.whyChooseUs : [
              { icon: "🏆", title: "20+ Years Experience", desc: "Two decades of transforming spaces across Hyderabad" },
              { icon: "👨‍🎨", title: "Expert Artists", desc: "Team of skilled and experienced professional painters" },
              { icon: "✨", title: "Custom Designs", desc: "Tailored artwork to match your vision and space" },
              { icon: "💰", title: "Affordable Pricing", desc: "Premium quality at competitive market rates" },
              { icon: "⏰", title: "On-Time Delivery", desc: "We ensure timely completion of every project" },
              { icon: "🤝", title: "Free Consultation", desc: "Complimentary design consultation for new clients" },
            ]).map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
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

      {/* Testimonial Carousel */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading subtitle="Testimonials" title="What Our Clients Say" />
          <div className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-xl p-8 md:p-12 min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReview}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: reviews[currentReview % reviews.length]?.rating || 5 }).map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground text-lg md:text-xl italic leading-relaxed mb-6">
                  "{reviews[currentReview % reviews.length]?.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                    {reviews[currentReview % reviews.length]?.avatar}
                  </div>
                  <p className="font-heading font-bold text-primary">{reviews[currentReview % reviews.length]?.name}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 mt-8">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentReview(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentReview === i ? "w-8 bg-primary" : "w-2 bg-muted"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white">
              Ready to Transform Your Space?
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Get a free consultation and quote for your wall art project today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-all shadow-lg"
              >
                Contact Us
              </Link>
              <a
                href={`https://wa.me/918121341742`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#25D366]/90 transition-all shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedLightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-md"
            onClick={() => setSelectedLightboxImage(null)}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-[60]"
              onClick={() => setSelectedLightboxImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content wrapper */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedLightboxImage.imageUrl}
                alt={selectedLightboxImage.altText || selectedLightboxImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-gold/20"
              />
              <div className="text-center mt-4 space-y-1">
                <h3 className="font-heading text-lg md:text-xl font-bold text-white">{selectedLightboxImage.title}</h3>
                {selectedLightboxImage.altText && (
                  <p className="text-sm text-white/70 max-w-2xl mx-auto">{selectedLightboxImage.altText}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
