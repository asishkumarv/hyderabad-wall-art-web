import { useEffect, useState, useCallback } from "react";
import { API_URL } from "./constants";

export type ServiceKey = "commercial" | "home" | "mural" | "stencil";
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

export type GalleryImage = {
  id: string;
  title: string;
  category: string;
  altText: string;
  imageUrl: string;
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

export type SitePages = {
  home: { heroTitle: string; heroImages: string[] };
  about: { title: string; content: string; founderName: string; founderImage: string; founderDescription: string };
  contact: { phone: string; email: string; address: string; whatsapp: string; mapEmbed: string };
};

export function useStore() {
  const [data, setData] = useState<{
    services: ServiceContent[];
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
    gallery: [],
    blogPosts: [],
    categories: [],
    videos: [],
    testimonials: [],
    pages: {
      home: { heroTitle: "", heroImages: [] },
      about: { title: "", content: "", founderName: "", founderImage: "", founderDescription: "" },
      contact: { phone: "", email: "", address: "", whatsapp: "", mapEmbed: "" },
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
        "services", "gallery", "blogs", "categories", 
        "videos", "testimonials", "pages", "settings"
      ];
      
      const results = await Promise.all(
        endpoints.map(ep => fetch(`${API_URL}/${ep}`).then(res => res.json()))
      );

      const [services, gallery, blogs, categories, videos, testimonials, pages, settings] = results;

      setData({
        services: Array.isArray(services) ? services.map((s: any) => ({
          ...s,
          heroTitle: s.hero_title,
          heroSubtitle: s.hero_subtitle,
          whyChooseUs: s.why_choose_us || [],
          isActive: s.is_active,
          benefits: s.benefits || [],
          relatedServices: s.related_services || [],
        })) : [],
        gallery: Array.isArray(gallery) ? gallery.map((g: any) => ({
          ...g,
          altText: g.alt_text,
          imageUrl: g.image_url,
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
          home: (pages && pages.home) || { heroTitle: "", heroImages: [] },
          about: (pages && pages.about) || { title: "", content: "", founderName: "", founderImage: "", founderDescription: "" },
          contact: (pages && pages.contact) || { phone: "", email: "", address: "", whatsapp: "", mapEmbed: "" },
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
