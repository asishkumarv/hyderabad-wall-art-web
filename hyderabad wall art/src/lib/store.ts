import { useEffect, useState, useCallback } from "react";
import { API_URL } from "./constants";

export type ServiceKey = string;
export type ServiceContent = {
  key: ServiceKey;
  label: string;
  heroTitle: string;
  heroSubtitle: string;
  whyChooseUs: string[];
  isActive: boolean;
  category: "Home" | "Commercial";
  subcategory: string;
  description: string;
  images: string[];
  benefits: string[];
  relatedServices: { label: string; to: string }[];
};

export type GallerySection = {
  id: string;
  title: string;
  isActive: boolean;
  orderIndex: number;
  createdAt: number;
};

export type GalleryImage = {
  id: string;
  sectionId: string;
  title: string;
  altText: string;
  imageUrl: string;
  isActive: boolean;
  orderIndex: number;
  createdAt: number;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  gallery_images?: string[];
  createdAt: number;
};

export type WallpaperCategory = {
  id: string;
  name: string;
  image: string;
  description: string;
};

export type VideoRecord = {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
};

export type TestimonialRecord = {
  id: string;
  name: string;
  initials: string;
  rating: number;
  message: string;
  image: string;
  createdAt: number;
};

export type SiteSettings = {
  siteName: string;
  logo: string;
  social: {
    whatsapp: string;
    instagram: string;
    youtube: string;
  };
  footer: string;
  whatsappNumber: string;
  instagramUrl: string;
  officeAddress: string;
};

export type WhyChoosePoint = { icon: string; title: string; desc: string };
export type StatPoint = { num: string; label: string };

export type HeroSlide = {
  image: string;
  title: string;
  subtitle: string;
};

export type HomePageContent = {
  heroSlides: HeroSlide[];
  whyChooseUs: WhyChoosePoint[];
  stats: StatPoint[];
};

export type ExpertisePoint = { name: string; pct: number };

export type AboutPageContent = {
  title: string;
  content: string;
  founderName: string;
  founderImage: string;
  founderDescription: string;
  expertise: ExpertisePoint[];
};

export type ContactPageContent = {
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  mapEmbed: string;
  workingHours: string;
};

export type SitePages = {
  home: HomePageContent;
  about: AboutPageContent;
  contact: ContactPageContent;
};

export function useStore() {
  const [data, setData] = useState<{
    services: ServiceContent[];
    gallerySections: GallerySection[];
    gallery: GalleryImage[];
    blogPosts: BlogPost[];
    categories: WallpaperCategory[];
    videos: VideoRecord[];
    testimonials: TestimonialRecord[];
    pages: SitePages;
    settings: SiteSettings;
    isLoading: boolean;
  }>({
    services: [],
    gallerySections: [],
    gallery: [],
    blogPosts: [],
    categories: [],
    videos: [],
    testimonials: [],
    pages: {
      home: { heroSlides: [], whyChooseUs: [], stats: [] },
      about: { title: "", content: "", founderName: "", founderImage: "", founderDescription: "", expertise: [] },
      contact: { phone: "", email: "", address: "", whatsapp: "", mapEmbed: "", workingHours: "" },
    },
    settings: {
      siteName: "Hyderabad Wall Arts",
      logo: "",
      social: { whatsapp: "", instagram: "", youtube: "" },
      footer: "",
      whatsappNumber: "",
      instagramUrl: "",
      officeAddress: "",
    },
    isLoading: true,
  });

  const fetchData = useCallback(async () => {
    try {
      const endpoints = [
        "services", "gallery-sections", "gallery", "blogs", "categories", 
        "videos", "testimonials", "pages", "settings"
      ];
      
      const results = await Promise.all(
        endpoints.map(ep => fetch(`${API_URL}/${ep}`).then(res => res.json()))
      );

      const [services, gallerySections, gallery, blogs, categories, videos, testimonials, pages, settings] = results;

      setData({
        services: Array.isArray(services) ? services.map((s: any) => {
          let benefits = [];
          if (Array.isArray(s.benefits)) {
            benefits = s.benefits;
          } else if (typeof s.benefits === "string" && s.benefits.trim()) {
            try {
              benefits = JSON.parse(s.benefits);
            } catch (e) {
              console.error("Failed to parse benefits:", e);
            }
          }

          let relatedServices = [];
          if (Array.isArray(s.related_services)) {
            relatedServices = s.related_services;
          } else if (typeof s.related_services === "string" && s.related_services.trim()) {
            try {
              relatedServices = JSON.parse(s.related_services);
            } catch (e) {
              console.error("Failed to parse related_services:", e);
            }
          }

          let whyChooseUs = [];
          if (Array.isArray(s.why_choose_us)) {
            whyChooseUs = s.why_choose_us;
          } else if (typeof s.why_choose_us === "string" && s.why_choose_us.trim()) {
            try {
              whyChooseUs = JSON.parse(s.why_choose_us);
            } catch (e) {
              console.error("Failed to parse why_choose_us:", e);
            }
          }

          return {
            ...s,
            heroTitle: s.hero_title,
            heroSubtitle: s.hero_subtitle,
            whyChooseUs,
            isActive: s.is_active,
            images: s.images || [],
            benefits,
            relatedServices,
          };
        }) : [],
        gallerySections: Array.isArray(gallerySections) ? gallerySections.map((s: any) => ({
          ...s,
          isActive: s.is_active,
          orderIndex: s.order_index,
          createdAt: new Date(s.created_at).getTime(),
        })) : [],
        gallery: Array.isArray(gallery) ? gallery.map((g: any) => ({
          ...g,
          sectionId: g.section_id,
          altText: g.alt_text,
          imageUrl: g.image_url,
          isActive: g.is_active,
          orderIndex: g.order_index,
          createdAt: new Date(g.created_at).getTime(),
        })) : [],
        blogPosts: Array.isArray(blogs) ? blogs.map((b: any) => ({
          ...b,
          createdAt: new Date(b.created_at).getTime(),
        })) : [],
        categories: Array.isArray(categories) ? categories : [],
        videos: Array.isArray(videos) ? videos.map((v: any) => ({
          ...v,
          videoUrl: v.video_url,
        })) : [],
        testimonials: Array.isArray(testimonials) ? testimonials.map((t: any) => ({
          ...t,
          createdAt: new Date(t.created_at).getTime(),
        })) : [],
        pages: {
          home: (pages && pages.home) || { heroSlides: [], whyChooseUs: [], stats: [] },
          about: (pages && pages.about) || { title: "", content: "", founderName: "", founderImage: "", founderDescription: "", expertise: [] },
          contact: (pages && pages.contact) || { phone: "", email: "", address: "", whatsapp: "", mapEmbed: "", workingHours: "" },
        },
        settings: settings ? {
          ...settings,
          siteName: settings.site_name,
          whatsappNumber: settings.whatsapp_number,
          instagramUrl: settings.instagram_url,
          officeAddress: settings.office_address,
        } : data.settings,
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to fetch store data:", err);
      setData(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const submitLead = async (lead: any) => {
    const res = await fetch(`${API_URL}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    return res.json();
  };

  const submitContact = async (contact: any) => {
    const res = await fetch(`${API_URL}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });
    return res.json();
  };

  return {
    ...data,
    submitLead,
    submitContact,
    refresh: fetchData,
  };
}
