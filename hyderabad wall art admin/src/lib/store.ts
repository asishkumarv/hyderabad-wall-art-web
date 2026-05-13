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

export type BlogCategory = "Design Tips" | "Process" | "Case Studies";
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
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

export type HomePageContent = {
  heroTitle: string;
  heroImages: string[];
};

export type AboutPageContent = {
  title: string;
  content: string;
  founderName: string;
  founderImage: string;
  founderDescription: string;
};

export type ContactPageContent = {
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  mapEmbed: string;
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
        })),
        gallery: gallery.map((g: any) => ({
          ...g,
          altText: g.alt_text,
          imageUrl: g.image_url,
          createdAt: new Date(g.created_at).getTime(),
        })),
        leads: leads.map((l: any) => ({
          ...l,
          locationTag: l.location_tag,
          suggestedLocation: l.suggested_location,
          createdAt: new Date(l.created_at).getTime(),
          lastStatusChangeAt: new Date(l.last_status_change_at).getTime(),
        })),
        blogPosts: blogs.map((b: any) => ({
          ...b,
          createdAt: new Date(b.created_at).getTime(),
        })),
        categories,
        videos: videos.map((v: any) => ({
          ...v,
          videoUrl: v.video_url,
        })),
        testimonials: testimonials.map((t: any) => ({
          ...t,
          createdAt: new Date(t.created_at).getTime(),
        })),
        contacts: contacts.map((c: any) => ({
          ...c,
          date: new Date(c.created_at).getTime(),
        })),
        activities: activities.map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp).getTime(),
        })),
        pages: {
          home: pages.home || { heroTitle: "", heroImages: [] },
          about: pages.about || { title: "", content: "", founderName: "", founderImage: "", founderDescription: "" },
          contact: pages.contact || { phone: "", email: "", address: "", whatsapp: "", mapEmbed: "" },
        },
        settings: {
          ...settings,
          siteName: settings.site_name,
          whatsappNumber: settings.whatsapp_number,
          instagramUrl: settings.instagram_url,
          officeAddress: settings.office_address,
        },
      });
    } catch (err) {
      console.error("Failed to fetch store data:", err);
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
    updateService: (key: ServiceKey, patch: any) => apiCall(`services/${key}`, "PUT", {
      ...patch,
      hero_title: patch.heroTitle,
      hero_subtitle: patch.heroSubtitle,
      why_choose_us: patch.whyChooseUs,
      is_active: patch.isActive,
    }),
    addWhyPoint: (key: ServiceKey) => {
      const service = data.services.find(s => s.key === key);
      if (!service) return;
      return apiCall(`services/${key}`, "PUT", {
        ...service,
        why_choose_us: [...service.whyChooseUs, "New selling point"],
      });
    },
    updateWhyPoint: (key: ServiceKey, index: number, value: string) => {
      const service = data.services.find(s => s.key === key);
      if (!service) return;
      const whyChooseUs = [...service.whyChooseUs];
      whyChooseUs[index] = value;
      return apiCall(`services/${key}`, "PUT", {
        ...service,
        why_choose_us: whyChooseUs,
      });
    },
    removeWhyPoint: (key: ServiceKey, index: number) => {
      const service = data.services.find(s => s.key === key);
      if (!service) return;
      return apiCall(`services/${key}`, "PUT", {
        ...service,
        why_choose_us: service.whyChooseUs.filter((_, i) => i !== index),
      });
    },
    addGalleryImage: (image: any) => apiCall("gallery", "POST", {
      ...image,
      alt_text: image.altText,
      image_url: image.imageUrl,
    }),
    updateGalleryImage: (id: string, patch: any) => apiCall(`gallery/${id}`, "PUT", {
      ...patch,
      alt_text: patch.altText,
      image_url: patch.imageUrl,
    }),
    deleteGalleryImage: (id: string) => apiCall(`gallery/${id}`, "DELETE"),
    updateLead: (id: string, patch: any) => apiCall(`leads/${id}`, "PUT", {
      ...patch,
      location_tag: patch.locationTag,
      suggested_location: patch.suggestedLocation,
      last_status_change_at: patch.lastStatusChangeAt ? new Date(patch.lastStatusChangeAt).toISOString() : undefined,
    }),
    addBlogPost: (post: any) => apiCall("blogs", "POST", post),
    updateBlogPost: (id: string, patch: any) => apiCall(`blogs/${id}`, "PUT", patch),
    deleteBlogPost: (id: string) => apiCall(`blogs/${id}`, "DELETE"),
    addCategory: (category: any) => apiCall("categories", "POST", category),
    updateCategory: (id: string, patch: any) => apiCall(`categories/${id}`, "PUT", patch),
    deleteCategory: (id: string) => apiCall(`categories/${id}`, "DELETE"),
    addVideo: (video: any) => apiCall("videos", "POST", {
      ...video,
      video_url: video.videoUrl,
    }),
    updateVideo: (id: string, patch: any) => apiCall(`videos/${id}`, "PUT", {
      ...patch,
      video_url: patch.videoUrl,
    }),
    deleteVideo: (id: string) => apiCall(`videos/${id}`, "DELETE"),
    addTestimonial: (testimonial: any) => apiCall("testimonials", "POST", testimonial),
    updateTestimonial: (id: string, patch: any) => apiCall(`testimonials/${id}`, "PUT", patch),
    deleteTestimonial: (id: string) => apiCall(`testimonials/${id}`, "DELETE"),
    updateHomePage: (patch: any) => apiCall("pages/home", "PUT", { content: { ...data.pages.home, ...patch } }),
    updateAboutPage: (patch: any) => apiCall("pages/about", "PUT", { content: { ...data.pages.about, ...patch } }),
    updateContactPage: (patch: any) => apiCall("pages/contact", "PUT", { content: { ...data.pages.contact, ...patch } }),
    addContactSubmission: (submission: any) => apiCall("contacts", "POST", submission),
    updateSettings: (patch: any) => apiCall("settings", "PUT", {
      ...patch,
      site_name: patch.siteName,
      whatsapp_number: patch.whatsappNumber,
      instagram_url: patch.instagramUrl,
      office_address: patch.officeAddress,
    }),
  };
}
