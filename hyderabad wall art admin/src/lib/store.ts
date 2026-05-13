import { useEffect, useState, useCallback } from "react";
import { API_URL } from "./constants";
import { useAuth } from "./auth";

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

export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";
export type LeadRecord = {
  id: string;
  name: string;
  phone: string;
  inquiry: string;
  source: string;
  locationTag: string;
  suggestedLocation: string;
  createdAt: number;
  lastStatusChangeAt: number;
  status: LeadStatus;
};

export type BlogCategory = string;
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
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

export type VideoCategory = "Home" | "Commercial" | "3D Art";
export type VideoRecord = {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  category: VideoCategory;
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

export type ActivityRecord = {
  id: string;
  message: string;
  timestamp: number;
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

export type ContactSubmission = {
  id: string;
  name: string;
  phone: string;
  message: string;
  date: number;
};

export type SiteSocial = {
  whatsapp: string;
  instagram: string;
  youtube: string;
};

export type SiteSettings = {
  siteName: string;
  logo: string;
  social: SiteSocial;
  footer: string;
  whatsappNumber: string;
  instagramUrl: string;
  officeAddress: string;
};

export type SitePages = {
  home: HomePageContent;
  about: AboutPageContent;
  contact: ContactPageContent;
};

const HYDERABAD_AREAS = ["Hitech City", "Jubilee Hills", "Gachibowli", "Banjara Hills", "Madhapur", "Kondapur", "Kokapet"];

export function useStore() {
  const { token } = useAuth();
  const [data, setData] = useState<{
    services: ServiceContent[];
    gallery: GalleryImage[];
    leads: LeadRecord[];
    blogPosts: BlogPost[];
    categories: WallpaperCategory[];
    videos: VideoRecord[];
    testimonials: TestimonialRecord[];
    contacts: ContactSubmission[];
    activities: ActivityRecord[];
    pages: SitePages;
    settings: SiteSettings;
    isLoading: boolean;
  }>({
    services: [],
    gallery: [],
    leads: [],
    blogPosts: [],
    categories: [],
    videos: [],
    testimonials: [],
    contacts: [],
    activities: [],
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
        "services", "gallery", "leads", "blogs", "categories", 
        "videos", "testimonials", "contacts", "activities", "pages", "settings"
      ];
      
      const results = await Promise.all(
        endpoints.map(ep => 
          fetch(`${API_URL}/${ep}`, {
            headers: token ? { "Authorization": `Bearer ${token}` } : {}
          }).then(res => res.json())
        )
      );

      const [services, gallery, leads, blogs, categories, videos, testimonials, contacts, activities, pages, settings] = results;

      setData({
        services: services.map((s: any) => ({
          ...s,
          heroTitle: s.hero_title,
          heroSubtitle: s.hero_subtitle,
          whyChooseUs: s.why_choose_us,
          isActive: s.is_active,
          benefits: s.benefits || [],
          relatedServices: s.related_services || [],
        })),
        gallery: Array.isArray(gallery) ? gallery.map((g: any) => ({
          ...g,
          altText: g.alt_text,
          imageUrl: g.image_url,
          createdAt: new Date(g.created_at).getTime(),
        })) : [],
        leads: Array.isArray(leads) ? leads.map((l: any) => ({
          ...l,
          locationTag: l.location_tag,
          suggestedLocation: l.suggested_location,
          createdAt: new Date(l.created_at).getTime(),
          lastStatusChangeAt: new Date(l.last_status_change_at).getTime(),
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
        contacts: Array.isArray(contacts) ? contacts.map((c: any) => ({
          ...c,
          date: new Date(c.created_at).getTime(),
        })) : [],
        activities: Array.isArray(activities) ? activities.map((a: any) => ({
          ...a,
          timestamp: new Date(a.created_at).getTime(),
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
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const apiCall = async (endpoint: string, method: string, body?: any) => {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`API call failed: ${res.statusText}`);
    await fetchData();
    return res.json();
  };

  return {
    ...data,
    blogs: data.blogPosts,
    hyderabadAreas: HYDERABAD_AREAS,
    addActivity: (message: string) => apiCall("activities", "POST", { message }),
    updateService: (key: ServiceKey, patch: any) => {
      const body: any = {};
      if (patch.label !== undefined) body.label = patch.label;
      if (patch.heroTitle !== undefined) body.hero_title = patch.heroTitle;
      if (patch.heroSubtitle !== undefined) body.hero_subtitle = patch.heroSubtitle;
      if (patch.whyChooseUs !== undefined) body.why_choose_us = patch.whyChooseUs;
      if (patch.isActive !== undefined) body.is_active = patch.isActive;
      if (patch.category !== undefined) body.category = patch.category;
      if (patch.subcategory !== undefined) body.subcategory = patch.subcategory;
      if (patch.description !== undefined) body.description = patch.description;
      if (patch.images !== undefined) body.images = patch.images;
      if (patch.benefits !== undefined) body.benefits = patch.benefits;
      if (patch.relatedServices !== undefined) body.related_services = patch.relatedServices;
      return apiCall(`services/${key}`, "PUT", body);
    },
    addWhyPoint: (key: ServiceKey) => {
      const service = data.services.find(s => s.key === key);
      if (!service) return;
      return apiCall(`services/${key}`, "PUT", {
        why_choose_us: [...service.whyChooseUs, "New selling point"],
      });
    },
    updateWhyPoint: (key: ServiceKey, index: number, value: string) => {
      const service = data.services.find(s => s.key === key);
      if (!service) return;
      const whyChooseUs = [...service.whyChooseUs];
      whyChooseUs[index] = value;
      return apiCall(`services/${key}`, "PUT", {
        why_choose_us: whyChooseUs,
      });
    },
    removeWhyPoint: (key: ServiceKey, index: number) => {
      const service = data.services.find(s => s.key === key);
      if (!service) return;
      return apiCall(`services/${key}`, "PUT", {
        why_choose_us: service.whyChooseUs.filter((_, i) => i !== index),
      });
    },
    addGalleryImage: (image: any) => apiCall("gallery", "POST", {
      title: image.title,
      category: image.category,
      alt_text: image.altText,
      image_url: image.imageUrl,
    }),
    updateGalleryImage: (id: string, patch: any) => {
      const body: any = {};
      if (patch.title !== undefined) body.title = patch.title;
      if (patch.category !== undefined) body.category = patch.category;
      if (patch.altText !== undefined) body.alt_text = patch.altText;
      if (patch.imageUrl !== undefined) body.image_url = patch.imageUrl;
      return apiCall(`gallery/${id}`, "PUT", body);
    },
    deleteGalleryImage: (id: string) => apiCall(`gallery/${id}`, "DELETE"),
    addLead: (lead: any) => apiCall("leads", "POST", {
      name: lead.name,
      phone: lead.phone,
      inquiry: lead.inquiry,
      source: lead.source || "Direct / Admin",
      location_tag: lead.locationTag,
      suggested_location: lead.suggestedLocation,
      status: lead.status || "new",
    }),
    updateLead: (id: string, patch: any) => {
      const body: any = {};
      if (patch.name !== undefined) body.name = patch.name;
      if (patch.phone !== undefined) body.phone = patch.phone;
      if (patch.inquiry !== undefined) body.inquiry = patch.inquiry;
      if (patch.source !== undefined) body.source = patch.source;
      if (patch.locationTag !== undefined) body.location_tag = patch.locationTag;
      if (patch.suggestedLocation !== undefined) body.suggested_location = patch.suggestedLocation;
      if (patch.status !== undefined) body.status = patch.status;
      if (patch.lastStatusChangeAt !== undefined) body.last_status_change_at = new Date(patch.lastStatusChangeAt).toISOString();
      return apiCall(`leads/${id}`, "PUT", body);
    },
    deleteLead: (id: string) => apiCall(`leads/${id}`, "DELETE"),
    addBlogPost: (post: any) => apiCall("blogs", "POST", post),
    updateBlogPost: (id: string, patch: any) => apiCall(`blogs/${id}`, "PUT", patch),
    deleteBlogPost: (id: string) => apiCall(`blogs/${id}`, "DELETE"),
    addCategory: (category: any) => apiCall("categories", "POST", category),
    updateCategory: (id: string, patch: any) => apiCall(`categories/${id}`, "PUT", patch),
    deleteCategory: (id: string) => apiCall(`categories/${id}`, "DELETE"),
    addVideo: (video: any) => apiCall("videos", "POST", {
      title: video.title,
      thumbnail: video.thumbnail,
      video_url: video.videoUrl,
      category: video.category,
    }),
    updateVideo: (id: string, patch: any) => {
      const body: any = {};
      if (patch.title !== undefined) body.title = patch.title;
      if (patch.thumbnail !== undefined) body.thumbnail = patch.thumbnail;
      if (patch.videoUrl !== undefined) body.video_url = patch.videoUrl;
      if (patch.category !== undefined) body.category = patch.category;
      return apiCall(`videos/${id}`, "PUT", body);
    },
    deleteVideo: (id: string) => apiCall(`videos/${id}`, "DELETE"),
    addTestimonial: (testimonial: any) => apiCall("testimonials", "POST", testimonial),
    updateTestimonial: (id: string, patch: any) => apiCall(`testimonials/${id}`, "PUT", patch),
    deleteTestimonial: (id: string) => apiCall(`testimonials/${id}`, "DELETE"),
    updateHomePage: (patch: any) => apiCall("pages/home", "PUT", { content: { ...data.pages.home, ...patch } }),
    updateAboutPage: (patch: any) => apiCall("pages/about", "PUT", { content: { ...data.pages.about, ...patch } }),
    updateContactPage: (patch: any) => apiCall("pages/contact", "PUT", { content: { ...data.pages.contact, ...patch } }),
    addContactSubmission: (submission: any) => apiCall("contacts", "POST", submission),
    updateSettings: (patch: any) => {
      const body: any = {};
      if (patch.siteName !== undefined) body.site_name = patch.siteName;
      if (patch.logo !== undefined) body.logo = patch.logo;
      if (patch.social !== undefined) body.social = patch.social;
      if (patch.footer !== undefined) body.footer = patch.footer;
      if (patch.whatsappNumber !== undefined) body.whatsapp_number = patch.whatsappNumber;
      if (patch.instagramUrl !== undefined) body.instagram_url = patch.instagramUrl;
      if (patch.officeAddress !== undefined) body.office_address = patch.officeAddress;
      return apiCall("settings", "PUT", body);
    },
  };
}
