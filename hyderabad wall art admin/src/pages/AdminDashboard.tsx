import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  BellRing,
  Bold,
  BookOpenText,
  ChevronRight,
  CircleUserRound,
  FileText,
  FolderKanban,
  Home,
  ImagePlus,
  LayoutDashboard,
  List,
  Menu,
  MessageCircle,
  MessageSquareQuote,
  Moon,
  Play,
  Plus,
  Settings,
  Star,
  SunMedium,
  Trash2,
  UploadCloud,
  Video,
  Wallpaper,
  X,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { useThemeMode } from "@/components/admin/AdminThemeProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { uploadToCloudinary, uploadManyToCloudinary } from "@/lib/cloudinary";
import { renderRichText } from "@/lib/rich-text";
import {
  useStore,
  type BlogCategory,
  type BlogPost,
  type ContactSubmission,
  type GalleryImage,
  type LeadStatus,
  type TestimonialRecord,
  type VideoCategory,
} from "@/lib/store";

const sections = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { key: "gallery", label: "Gallery", icon: ImagePlus, path: "/admin/gallery" },
  { key: "blogs", label: "Blogs", icon: FileText, path: "/admin/blogs" },
  { key: "categories", label: "Categories", icon: Wallpaper, path: "/admin/categories" },
  { key: "videos", label: "Videos", icon: Video, path: "/admin/videos" },
  { key: "services", label: "Services", icon: FolderKanban, path: "/admin/services" },
  { key: "pages", label: "Pages", icon: BookOpenText, path: "/admin/pages" },
  { key: "testimonials", label: "Testimonials", icon: MessageSquareQuote, path: "/admin/testimonials" },
  { key: "contacts", label: "Contacts", icon: BellRing, path: "/admin/contacts" },
  { key: "profile", label: "Profile", icon: CircleUserRound, path: "/admin/profile" },
  { key: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
] as const;

type SectionKey = (typeof sections)[number]["key"];
type BlogDraft = { id?: string; title: string; category: BlogCategory; excerpt: string; content: string; image: string; gallery_images: string[] };
type CategoryDraft = { id?: string; name: string; image: string; description: string };
type VideoDraft = { id?: string; title: string; thumbnail: string; videoUrl: string; category: VideoCategory };
type TestimonialDraft = { id?: string; name: string; rating: number; message: string; image: string };
type ProfileDraft = { name: string; email: string; role: string; phone: string; avatar: string; accountStatus: string; permissions: string[] };
type LeadDraft = { name: string; phone: string; inquiry: string; source: string; locationTag: string; status: LeadStatus };

const emptyBlogDraft: BlogDraft = { title: "", category: "Design Tips", excerpt: "", content: "", image: "", gallery_images: [] };
const emptyCategoryDraft: CategoryDraft = { name: "", image: "", description: "" };
const emptyVideoDraft: VideoDraft = { title: "", thumbnail: "", videoUrl: "", category: "Home" };
const emptyTestimonialDraft: TestimonialDraft = { name: "", rating: 5, message: "", image: "" };
const leadStatuses: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];
const emptyLeadDraft: LeadDraft = { name: "", phone: "", inquiry: "", source: "Admin Entry", locationTag: "", status: "new" };
const videoCategories: VideoCategory[] = ["Home", "Commercial", "3D Art"];

function formatRelative(hoursAgoMs: number) {
  const hours = Math.max(1, Math.round(hoursAgoMs / (1000 * 60 * 60)));
  return `${hours}h ago`;
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || "untitled-post";
}

function appendSnippet(content: string, snippet: string) {
  return `${content}${content.trim() ? "\n\n" : ""}${snippet}`;
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function FeedbackModal({ open, onOpenChange, title, message, type = "success" }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; message: string; type?: "success" | "error" }) {
  const isSuccess = type === "success";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`panel-luxury ${isSuccess ? "border-gold/50" : "border-destructive/50"} text-center py-12 sm:max-w-md overflow-hidden`}>
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 15 }}>
          <div className={`mx-auto w-24 h-24 rounded-full ${isSuccess ? "bg-gold/10" : "bg-destructive/10"} flex items-center justify-center mb-6 relative`}>
             <motion.div 
               className={`absolute inset-0 rounded-full border-2 ${isSuccess ? "border-gold/30" : "border-destructive/30"}`}
               initial={{ scale: 1 }}
               animate={{ scale: 1.5, opacity: 0 }}
               transition={{ duration: 1.5, repeat: Infinity }}
             />
            {isSuccess ? <Check className="h-12 w-12 text-gold" /> : <AlertCircle className="h-12 w-12 text-destructive" />}
          </div>
          <h2 className={`text-3xl font-bold tracking-tight mb-2 ${isSuccess ? "text-foreground" : "text-destructive"}`}>{title}</h2>
          <p className="text-muted-foreground mb-8 text-lg">{message}</p>
          <Button variant={isSuccess ? "luxury" : "destructive"} onClick={() => onOpenChange(false)} className="px-12 h-12 text-lg shadow-gold">Done</Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

function ModuleShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Card className="panel-luxury">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}



function SidebarNav({ currentSection, onNavigate }: { currentSection: SectionKey; onNavigate?: () => void }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-6 space-y-2">
      {sections.map((item) => {
        const Icon = item.icon;
        const active = item.key === currentSection;
        return (
          <button
            key={item.key}
            onClick={() => {
              navigate(item.path);
              window.scrollTo({ top: 0, left: 0, behavior: "auto" });
              onNavigate?.();
            }}
            className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${active ? "panel-active text-foreground shadow-gold" : "border-transparent text-muted-foreground hover:border-border hover:bg-secondary/60 hover:text-foreground"}`}
          >
            <span className="flex items-center gap-3 font-medium">
              <Icon className="h-4 w-4 text-primary" />
              {item.label}
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>
        );
      })}
    </nav>
  );
}

export default function AdminDashboard() {
  const { isAuthenticated, user, updateProfile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    services,
    gallery,
    gallerySections,
    leads,
    blogPosts,
    categories,
    videos,
    testimonials,
    activities,
    pages,
    contacts,
    settings,
    hyderabadAreas,
    updateService,
    addWhyPoint,
    updateWhyPoint,
    removeWhyPoint,
    addGallerySection,
    updateGallerySection,
    deleteGallerySection,
    addGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
    updateLead,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addCategory,
    updateCategory,
    deleteCategory,
    addVideo,
    updateVideo,
    deleteVideo,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    updateHomePage,
    updateAboutPage,
    updateContactPage,
    updateSettings,
    addLead,
    deleteLead,
    isLoading,
  } = useStore();
  const { theme, toggleTheme } = useThemeMode();

  const currentSection = sections.find((item) => location.pathname.startsWith(item.path))?.key ?? "dashboard";
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [galleryDropActive, setGalleryDropActive] = useState(false);
  const [blogDraft, setBlogDraft] = useState<BlogDraft>(emptyBlogDraft);
  const [categoryDraft, setCategoryDraft] = useState<CategoryDraft>(emptyCategoryDraft);
  const [videoDraft, setVideoDraft] = useState<VideoDraft>(emptyVideoDraft);
  const [testimonialDraft, setTestimonialDraft] = useState<TestimonialDraft>(emptyTestimonialDraft);
  const [leadDraft, setLeadDraft] = useState<LeadDraft>(emptyLeadDraft);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDraft, setProfileDraft] = useState<ProfileDraft | null>(null);
  const [settingsDraft, setSettingsDraft] = useState<any>(null);
  const [pagesDraft, setPagesDraft] = useState<any>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  
  // Gallery Management States
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionOrder, setNewSectionOrder] = useState(0);
  const [newSectionIsActive, setNewSectionIsActive] = useState(true);
  
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState("");
  const [editingSectionOrder, setEditingSectionOrder] = useState(0);
  const [editingSectionIsActive, setEditingSectionIsActive] = useState(true);

  const [newImageTitle, setNewImageTitle] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [newImageOrder, setNewImageOrder] = useState(0);
  const [newImageIsActive, setNewImageIsActive] = useState(true);
  const [newImageUrl, setNewImageUrl] = useState("");

  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingImageTitle, setEditingImageTitle] = useState("");
  const [editingImageAlt, setEditingImageAlt] = useState("");
  const [editingImageOrder, setEditingImageOrder] = useState(0);
  const [editingImageIsActive, setEditingImageIsActive] = useState(true);
  const [editingImageSectionId, setEditingImageSectionId] = useState("");
  const [editingImageUrl, setEditingImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ open: boolean; title: string; message: string; type: "success" | "error" }>({ open: false, title: "", message: "", type: "success" });
  const [serviceDrafts, setServiceDrafts] = useState<Record<string, any>>({});

  const galleryUploadRef = useRef<HTMLInputElement>(null);
  const editImageUploadRef = useRef<HTMLInputElement>(null);
  const blogUploadRef = useRef<HTMLInputElement>(null);
  const blogGalleryUploadRef = useRef<HTMLInputElement>(null);
  const categoryUploadRef = useRef<HTMLInputElement>(null);
  const videoUploadRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);
  const testimonialUploadRef = useRef<HTMLInputElement>(null);
  const aboutUploadRef = useRef<HTMLInputElement>(null);
  const homeUploadRef = useRef<HTMLInputElement>(null);
  const settingsLogoUploadRef = useRef<HTMLInputElement>(null);
  const serviceUploadRefs = useRef<Record<string, HTMLInputElement | null>>({});

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const gallerySectionsMap = new Map(gallerySections.map((s) => [s.id, s.title]));
  const galleryCategories = ["All", ...new Set(gallery.map((image) => gallerySectionsMap.get(image.sectionId) || "Other"))];
  const filteredGallery = galleryFilter === "All" ? gallery : gallery.filter((image) => (gallerySectionsMap.get(image.sectionId) || "Other") === galleryFilter);
  const needsFollowUpCount = leads.filter((lead) => Date.now() - lead.lastStatusChangeAt > 1000 * 60 * 60 * 24).length;
  const visibleServices = services.filter((service) => service.isActive).length;
  const latestActivities = [...activities].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

  const metricCards = [
    { label: "Visible services", value: visibleServices, helper: "Frontend cards live" },
    { label: "Blogs", value: blogPosts.length, helper: "Read More enabled" },
    { label: "Categories", value: categories.length, helper: "Dynamic filters bound" },
    { label: "Videos", value: videos.length, helper: "Playable cards synced" },
    { label: "Testimonials", value: testimonials.length, helper: "Social proof live" },
    { label: "Contacts", value: contacts.length, helper: "Stored in localStorage" },
  ];

  const [isUploading, setIsUploading] = useState(false);

  const handleGalleryUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(file, "image");
      addGalleryImage({
        title: file.name.replace(/\.[^.]+$/, ""),
        category: galleryFilter === "All" ? "Living Room" : galleryFilter,
        altText: `Wall art installation in ${hyderabadAreas[0]}`,
        imageUrl,
      });
      toast.success("Image uploaded to Cloudinary");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setGalleryDropActive(false);
    await handleGalleryUpload(event.dataTransfer.files);
  };

  const handleSingleUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    onDone: (value: string) => void,
    resourceType: "image" | "video" | "auto" = "auto"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file, resourceType);
      onDone(url);
      toast.success("Uploaded to Cloudinary");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setIsUploading(false);
      (event.target as HTMLInputElement).value = "";
    }
  };

  const handleMultipleUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    onDone: (values: string[]) => void,
    resourceType: "image" | "video" | "auto" = "image"
  ) => {
    const files = event.target.files;
    if (!files) return;
    setIsUploading(true);
    try {
      const urls = await uploadManyToCloudinary(files, resourceType);
      onDone(urls);
      toast.success(`${urls.length} file(s) uploaded to Cloudinary`);
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setIsUploading(false);
      (event.target as HTMLInputElement).value = "";
    }
  };

  useEffect(() => {
    if (!isLoading && user && !profileDraft) {
      setProfileDraft({
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        accountStatus: user.accountStatus,
        permissions: user.permissions
      });
    }
  }, [isLoading, user, profileDraft]);

  useEffect(() => {
    if (!isLoading && settings && !settingsDraft) {
      setSettingsDraft({ ...settings });
    }
  }, [isLoading, settings, settingsDraft]);

  useEffect(() => {
    if (!isLoading && pages && !pagesDraft) {
      setPagesDraft({ ...pages });
    }
  }, [isLoading, pages, pagesDraft]);

  useEffect(() => {
    if (!isLoading && services.length > 0 && Object.keys(serviceDrafts).length === 0) {
      const drafts: Record<string, any> = {};
      services.forEach(s => {
        drafts[s.key] = { ...s };
      });
      setServiceDrafts(drafts);
    }
  }, [isLoading, services, serviceDrafts]);

  const saveBlogDraft = async () => {
    if (!blogDraft.title.trim() || !blogDraft.content.trim()) return;
    const payload = {
      ...blogDraft,
      slug: slugify(blogDraft.title),
      image: blogDraft.image || "/hwa-wall-bg.jpg",
    };
    setIsSaving(true);
    try {
      if (blogDraft.id) await updateBlogPost(blogDraft.id, payload);
      else await addBlogPost(payload);
      setFeedback({
        open: true,
        type: "success",
        title: "Success!",
        message: blogDraft.id ? "Your blog post has been updated." : "Your new blog post is now live!"
      });
      setBlogDraft(emptyBlogDraft);
    } catch (err) {
      setFeedback({
        open: true,
        type: "error",
        title: "Save Failed",
        message: "There was an error saving your blog post. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveCategoryDraft = async () => {
    if (!categoryDraft.name.trim()) return;
    setIsSaving(true);
    try {
      if (categoryDraft.id) await updateCategory(categoryDraft.id, categoryDraft);
      else await addCategory({ ...categoryDraft, image: categoryDraft.image || "/hwa-wall-bg.jpg" });
      setFeedback({
        open: true,
        type: "success",
        title: "Category Saved",
        message: categoryDraft.id ? "The category details have been updated." : "New wallpaper category added successfully."
      });
      setCategoryDraft(emptyCategoryDraft);
    } catch (err) {
      setFeedback({
        open: true,
        type: "error",
        title: "Save Failed",
        message: "Failed to save the category. Please check your inputs."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveVideoDraft = async () => {
    if (!videoDraft.title.trim() || !videoDraft.videoUrl.trim()) return;
    setIsSaving(true);
    try {
      if (videoDraft.id) await updateVideo(videoDraft.id, { ...videoDraft, thumbnail: videoDraft.thumbnail || "/hwa-wall-bg.jpg" });
      else await addVideo({ ...videoDraft, thumbnail: videoDraft.thumbnail || "/hwa-wall-bg.jpg" });
      setFeedback({
        open: true,
        type: "success",
        title: "Video Published",
        message: videoDraft.id ? "The video information has been updated." : "Your new video is now in the gallery."
      });
      setVideoDraft(emptyVideoDraft);
    } catch (err) {
      setFeedback({
        open: true,
        type: "error",
        title: "Publish Failed",
        message: "There was an error publishing the video."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveTestimonialDraft = async () => {
    if (!testimonialDraft.name.trim() || !testimonialDraft.message.trim()) return;
    const payload = {
      ...testimonialDraft,
      image: testimonialDraft.image || "",
    };
    setIsSaving(true);
    try {
      if (testimonialDraft.id) await updateTestimonial(testimonialDraft.id, payload);
      else await addTestimonial(payload);
      setFeedback({
        open: true,
        type: "success",
        title: "Testimonial Saved",
        message: testimonialDraft.id ? "Testimonial updated successfully." : "New testimonial added to the site."
      });
      setTestimonialDraft(emptyTestimonialDraft);
    } catch (err) {
      setFeedback({
        open: true,
        type: "error",
        title: "Update Failed",
        message: "There was an error saving the testimonial. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Cloudinary Upload Overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/70 bg-card px-10 py-8 shadow-elevated">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-lg font-semibold tracking-tight">Uploading to Cloudinary…</p>
            <p className="text-sm text-muted-foreground">Please wait, your file is being uploaded</p>
          </div>
        </div>
      )}
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-border/70 bg-card/70 backdrop-blur-xl lg:block">
          <div className="admin-scroll sticky top-0 flex h-screen flex-col overflow-y-auto overflow-x-hidden px-5 py-6">
            <div className="flex items-center gap-3 border-b border-border/70 pb-5">
              <BrandLogo size={48} />
              <div>
                <p className="text-lg font-semibold tracking-tight">{settings.siteName}</p>
                <p className="text-sm text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
            <SidebarNav currentSection={currentSection} />
            <div className="mt-auto space-y-3 border-t border-border/70 pt-5">
              <Card className="panel-luxury bg-canvas-texture">
                <CardContent className="space-y-2 p-4">
                  <p className="text-sm text-muted-foreground">Global WhatsApp</p>
                  <p className="text-lg font-semibold tracking-tight">8121341742</p>
                </CardContent>
              </Card>
              <Button asChild variant="glass" className="w-full justify-center">
                <Link to="/">
                  <Home className="h-4 w-4" />
                  Back to site
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-center" onClick={() => { logout(); navigate("/login"); }}>
                Logout
              </Button>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
            <div className="container flex h-20 items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="admin-scroll h-full overflow-y-auto overflow-x-hidden border-r border-border/70 bg-card/95 p-0 backdrop-blur-xl">
                    <div className="flex min-h-full flex-col overflow-x-hidden px-5 py-6">
                      <div className="flex items-center gap-3 border-b border-border/70 pb-5">
                        <div className="flex items-center gap-3">
                          <BrandLogo size={40} />
                          <div>
                            <SheetTitle className="text-lg font-semibold tracking-tight">{settings.siteName}</SheetTitle>
                            <p className="text-sm text-muted-foreground">Admin Dashboard</p>
                          </div>
                        </div>
                      </div>
                      <SidebarNav currentSection={currentSection} onNavigate={() => setMobileOpen(false)} />
                      <Card className="mt-6 panel-luxury bg-canvas-texture">
                        <CardContent className="space-y-2 p-4">
                          <p className="text-sm text-muted-foreground">Global WhatsApp</p>
                          <p className="text-lg font-semibold tracking-tight">8121341742</p>
                        </CardContent>
                      </Card>
                      <div className="mt-auto space-y-3 border-t border-border/70 pt-5">
                        <Button asChild variant="glass" className="w-full justify-center" onClick={() => setMobileOpen(false)}>
                          <Link to="/">Back to site</Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-center" onClick={() => { setMobileOpen(false); logout(); navigate("/login"); }}>
                          Logout
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-primary">Management layer</p>
                  <h1 className="mt-1 text-3xl font-semibold tracking-tight">{sections.find((item) => item.key === currentSection)?.label}</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden rounded-full border border-border/70 bg-card px-4 py-2 text-sm text-muted-foreground sm:block">
                  {theme === "dark" ? "Gold glow active" : "Canvas texture active"}
                </div>
                <Button variant="glass" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                  {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </header>

          <main className="container overflow-x-hidden py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
                className="space-y-6"
              >
                {currentSection === "dashboard" && (
                  <div className="space-y-6">
                    <Card className="panel-luxury">
                      <CardContent className="flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.22em] text-primary">Welcome</p>
                          <h2 className="mt-1 text-2xl font-semibold tracking-tight">{user?.name || "Admin"}</h2>
                          <p className="text-sm text-muted-foreground">Signed in as {user?.role || "Administrator"} · {user?.email || "admin@hyderabadwallarts.com"}</p>
                        </div>
                        <Button variant="outline" onClick={() => navigate("/admin/profile")}>View profile</Button>
                      </CardContent>
                    </Card>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {metricCards.map((item) => (
                        <Card key={item.label} className="panel-luxury panel-hover panel-active">
                          <CardContent className="space-y-2 p-6">
                            <p className="text-sm text-muted-foreground">{item.label}</p>
                            <p className="text-4xl font-semibold tracking-tight">{item.value}</p>
                            <p className="text-xs uppercase tracking-[0.22em] text-primary">{item.helper}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                      <ModuleShell title="Recent Activity" description="Latest 10 admin actions across blogs, categories, videos, services, testimonials, and contacts.">
                        <div className="space-y-3">
                          {latestActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start justify-between rounded-2xl border border-border/70 bg-canvas-texture p-4">
                              <div>
                                <p className="font-medium tracking-tight">{activity.message}</p>
                                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{formatDate(activity.timestamp)}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">{formatRelative(Date.now() - activity.timestamp)}</p>
                            </div>
                          ))}
                        </div>
                      </ModuleShell>
                      <ModuleShell title="Attention needed" description="Leads with stale statuses get a bell reminder after 24 hours without movement.">
                        <div className="space-y-3">
                          {leads.map((lead) => {
                            const stale = Date.now() - lead.lastStatusChangeAt > 1000 * 60 * 60 * 24;
                            return (
                              <div key={lead.id} className={`flex items-start justify-between rounded-2xl border p-4 ${stale ? "panel-active shadow-gold" : "border-border/70"}`}>
                                <div>
                                  <p className="font-medium tracking-tight">{lead.name}</p>
                                  <p className="text-sm text-muted-foreground">{lead.source} · {lead.locationTag || lead.suggestedLocation}</p>
                                </div>
                                <BellRing className={`h-4 w-4 ${stale ? "text-primary" : "text-muted-foreground"}`} />
                              </div>
                            );
                          })}
                        </div>
                      </ModuleShell>
                    </div>
                  </div>
                )}

                {currentSection === "gallery" && (
                  <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    {/* Left Panel: Artwork Images */}
                    <div className="space-y-6">
                      <ModuleShell title="Gallery Artworks" description="Select a section, upload images, and manage existing artwork layouts.">
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Select Gallery Section</label>
                            <Select 
                              value={selectedSectionId} 
                              onValueChange={(val) => {
                                setSelectedSectionId(val);
                                // Clear new image form
                                setNewImageTitle("");
                                setNewImageAlt("");
                                setNewImageUrl("");
                                setNewImageOrder(0);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="-- Choose a section --" />
                              </SelectTrigger>
                              <SelectContent>
                                {gallerySections.map((section) => (
                                  <SelectItem key={section.id} value={section.id}>
                                    {section.title} {!section.isActive ? "(Inactive)" : ""}
                                  </SelectItem>
                                ))}
                                {gallerySections.length === 0 && (
                                  <SelectItem value="none" disabled>No sections available. Create one first!</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          {selectedSectionId && selectedSectionId !== "none" ? (
                            <div className="space-y-6 pt-4 border-t border-border/70">
                              <h3 className="text-lg font-semibold text-primary">Add Artwork Image</h3>
                              
                              {/* Drag and Drop Zone */}
                              <div
                                onDragOver={(e) => { e.preventDefault(); setGalleryDropActive(true); }}
                                onDragLeave={() => setGalleryDropActive(false)}
                                onDrop={async (e) => {
                                  e.preventDefault();
                                  setGalleryDropActive(false);
                                  const file = e.dataTransfer.files?.[0];
                                  if (!file) return;
                                  setIsUploading(true);
                                  try {
                                    const url = await uploadToCloudinary(file, "image");
                                    setNewImageUrl(url);
                                    setNewImageTitle(file.name.replace(/\.[^.]+$/, ""));
                                    setNewImageAlt(`Wall art: ${file.name.replace(/\.[^.]+$/, "")}`);
                                    toast.success("Uploaded to Cloudinary");
                                  } catch (err: any) {
                                    toast.error(err?.message ?? "Upload failed");
                                  } finally {
                                    setIsUploading(false);
                                  }
                                }}
                                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-6 transition-all cursor-pointer ${
                                  galleryDropActive ? "border-gold bg-primary/5" : "border-border/75 hover:border-gold bg-canvas-texture/20"
                                }`}
                                onClick={() => galleryUploadRef.current?.click()}
                              >
                                <input
                                  ref={galleryUploadRef}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (event) => {
                                    const file = event.target.files?.[0];
                                    if (!file) return;
                                    setIsUploading(true);
                                    try {
                                      const url = await uploadToCloudinary(file, "image");
                                      setNewImageUrl(url);
                                      setNewImageTitle(file.name.replace(/\.[^.]+$/, ""));
                                      setNewImageAlt(`Wall art: ${file.name.replace(/\.[^.]+$/, "")}`);
                                      toast.success("Uploaded to Cloudinary");
                                    } catch (err: any) {
                                      toast.error(err?.message ?? "Upload failed");
                                    } finally {
                                      setIsUploading(false);
                                    }
                                  }}
                                />
                                {newImageUrl ? (
                                  <div className="relative group aspect-video w-full max-w-xs rounded-2xl overflow-hidden border border-border">
                                    <img src={newImageUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <p className="text-white text-xs font-semibold">Click or drag another to replace</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center space-y-2">
                                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground opacity-55" />
                                    <p className="text-sm font-medium">Drag & drop your artwork image here, or click to browse</p>
                                    <p className="text-xs text-muted-foreground">Supported files: JPG, PNG, WEBP (Max 100MB)</p>
                                  </div>
                                )}
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                  <label className="text-[11px] uppercase font-bold text-muted-foreground ml-1">Artwork Title</label>
                                  <Input 
                                    placeholder="Artwork Title" 
                                    value={newImageTitle} 
                                    onChange={(e) => setNewImageTitle(e.target.value)} 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[11px] uppercase font-bold text-muted-foreground ml-1">Alt Text (SEO)</label>
                                  <Input 
                                    placeholder="Alt description for accessibility" 
                                    value={newImageAlt} 
                                    onChange={(e) => setNewImageAlt(e.target.value)} 
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[11px] uppercase font-bold text-muted-foreground ml-1">Order Index</label>
                                  <Input 
                                    type="number" 
                                    value={newImageOrder} 
                                    onChange={(e) => setNewImageOrder(parseInt(e.target.value) || 0)} 
                                  />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-2xl border border-border bg-secondary/10">
                                  <div>
                                    <p className="text-sm font-semibold">Active Status</p>
                                    <p className="text-xs text-muted-foreground">Show in user website grid</p>
                                  </div>
                                  <Switch checked={newImageIsActive} onCheckedChange={setNewImageIsActive} />
                                </div>
                              </div>

                              <Button 
                                variant="luxury" 
                                className="w-full shadow-gold" 
                                disabled={!newImageUrl || isSaving}
                                onClick={async () => {
                                  setIsSaving(true);
                                  try {
                                    await addGalleryImage({
                                      sectionId: selectedSectionId,
                                      title: newImageTitle || "Untitled Artwork",
                                      altText: newImageAlt || newImageTitle || "Wall art",
                                      imageUrl: newImageUrl,
                                      orderIndex: newImageOrder,
                                      isActive: newImageIsActive
                                    });
                                    setNewImageTitle("");
                                    setNewImageAlt("");
                                    setNewImageUrl("");
                                    setNewImageOrder(0);
                                    setNewImageIsActive(true);
                                    toast.success("Artwork image saved to gallery");
                                  } catch (err: any) {
                                    toast.error(err?.message ?? "Failed to save artwork");
                                  } finally {
                                    setIsSaving(false);
                                  }
                                }}
                              >
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                Add Artwork to Gallery
                              </Button>

                              <div className="pt-6 border-t border-border/70 space-y-4">
                                <h3 className="text-lg font-semibold text-primary">Existing Artworks in Section</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                  {gallery.filter(img => img.sectionId === selectedSectionId).map((image) => {
                                    const isEditing = editingImageId === image.id;
                                    return (
                                      <Card key={image.id} className={`panel-luxury overflow-hidden ${!image.isActive ? "opacity-60" : ""}`}>
                                        <div className="relative aspect-video w-full bg-secondary/20">
                                          <img src={image.imageUrl} alt={image.title} className="h-full w-full object-cover" />
                                          <Badge className="absolute top-2 left-2" variant={image.isActive ? "secondary" : "outline"}>
                                            {image.isActive ? "Live" : "Inactive"}
                                          </Badge>
                                        </div>
                                        <CardContent className="p-4 space-y-3">
                                          {isEditing ? (
                                            <div className="space-y-3">
                                              {/* Image Replace */}
                                              <div className="space-y-1">
                                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Image</label>
                                                <div
                                                  className="relative group aspect-video w-full rounded-xl overflow-hidden border border-border cursor-pointer"
                                                  onClick={() => editImageUploadRef.current?.click()}
                                                >
                                                  <img
                                                    src={editingImageUrl || image.imageUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                  />
                                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                                    <UploadCloud className="h-6 w-6 text-white" />
                                                    <p className="text-white text-[10px] font-semibold">Click to replace image</p>
                                                  </div>
                                                  {isUploading && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                                                    </div>
                                                  )}
                                                </div>
                                                <input
                                                  ref={editImageUploadRef}
                                                  type="file"
                                                  accept="image/*"
                                                  className="hidden"
                                                  onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    setIsUploading(true);
                                                    try {
                                                      const url = await uploadToCloudinary(file, "image");
                                                      setEditingImageUrl(url);
                                                      toast.success("Image replaced — save to apply");
                                                    } catch (err: any) {
                                                      toast.error(err?.message ?? "Upload failed");
                                                    } finally {
                                                      setIsUploading(false);
                                                      (e.target as HTMLInputElement).value = "";
                                                    }
                                                  }}
                                                />
                                              </div>
                                              <div className="space-y-1">
                                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Title</label>
                                                <Input 
                                                  value={editingImageTitle} 
                                                  onChange={(e) => setEditingImageTitle(e.target.value)} 
                                                />
                                              </div>
                                              <div className="space-y-1">
                                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Alt Text</label>
                                                <Input 
                                                  value={editingImageAlt} 
                                                  onChange={(e) => setEditingImageAlt(e.target.value)} 
                                                />
                                              </div>
                                              <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Order Index</label>
                                                  <Input 
                                                    type="number" 
                                                    value={editingImageOrder} 
                                                    onChange={(e) => setEditingImageOrder(parseInt(e.target.value) || 0)} 
                                                  />
                                                </div>
                                                <div className="space-y-1">
                                                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Move to Section</label>
                                                  <Select value={editingImageSectionId} onValueChange={setEditingImageSectionId}>
                                                    <SelectTrigger className="h-9">
                                                      <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      {gallerySections.map((sec) => (
                                                        <SelectItem key={sec.id} value={sec.id}>{sec.title}</SelectItem>
                                                      ))}
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                              <div className="flex items-center justify-between py-1">
                                                <span className="text-xs font-semibold">Active Status</span>
                                                <Switch checked={editingImageIsActive} onCheckedChange={setEditingImageIsActive} />
                                              </div>
                                              <div className="flex justify-end gap-2 pt-2">
                                                <Button size="sm" variant="ghost" onClick={() => { setEditingImageId(null); setEditingImageUrl(""); }}>Cancel</Button>
                                                <Button size="sm" variant="luxury" onClick={async () => {
                                                  try {
                                                    const updatePayload: any = {
                                                      title: editingImageTitle,
                                                      altText: editingImageAlt,
                                                      orderIndex: editingImageOrder,
                                                      isActive: editingImageIsActive,
                                                      sectionId: editingImageSectionId
                                                    };
                                                    if (editingImageUrl) updatePayload.imageUrl = editingImageUrl;
                                                    await updateGalleryImage(image.id, updatePayload);
                                                    setEditingImageId(null);
                                                    setEditingImageUrl("");
                                                    toast.success("Artwork updated");
                                                  } catch (err: any) {
                                                    toast.error(err?.message ?? "Update failed");
                                                  }
                                                }}>Save</Button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="space-y-2">
                                              <div className="flex justify-between items-start">
                                                <div>
                                                  <h4 className="font-semibold text-sm">{image.title || "Untitled"}</h4>
                                                  <p className="text-xs text-muted-foreground">Alt: {image.altText || "—"}</p>
                                                  <p className="text-xs text-primary font-medium mt-1">Order: {image.orderIndex}</p>
                                                </div>
                                                <div className="flex gap-1 shrink-0">
                                                  <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-primary" 
                                                    onClick={() => {
                                                      setEditingImageId(image.id);
                                                      setEditingImageTitle(image.title);
                                                      setEditingImageAlt(image.altText);
                                                      setEditingImageOrder(image.orderIndex);
                                                      setEditingImageIsActive(image.isActive);
                                                      setEditingImageSectionId(image.sectionId);
                                                      setEditingImageUrl("");
                                                    }}
                                                  >
                                                    <FileText className="h-4 w-4" />
                                                  </Button>
                                                  <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-destructive"
                                                    onClick={async () => {
                                                      if (confirm("Delete this artwork?")) {
                                                        try {
                                                          await deleteGalleryImage(image.id);
                                                          toast.success("Artwork deleted");
                                                        } catch (err: any) {
                                                          toast.error(err?.message ?? "Delete failed");
                                                        }
                                                      }
                                                    }}
                                                  >
                                                    <Trash2 className="h-4 w-4" />
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>
                                    );
                                  })}
                                  {gallery.filter(img => img.sectionId === selectedSectionId).length === 0 && (
                                    <div className="col-span-2 py-8 text-center text-sm text-muted-foreground border border-dashed rounded-2xl bg-canvas-texture/20">
                                      No artwork images in this section yet. Upload one above!
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="py-12 text-center text-sm text-muted-foreground border border-dashed rounded-3xl bg-canvas-texture/20">
                              Please select a gallery section from the dropdown list to manage its artwork.
                            </div>
                          )}
                        </div>
                      </ModuleShell>
                    </div>

                    {/* Right Panel: Sections Management */}
                    <div className="space-y-6">
                      <ModuleShell title="Gallery Sections" description="Create, order, and toggle status of parent artwork categories.">
                        <div className="space-y-5">
                          {/* Add Section Form */}
                          <div className="space-y-4 p-4 rounded-3xl border border-border/70 bg-canvas-texture/25">
                            <h3 className="text-sm font-semibold tracking-wider uppercase text-primary">Create New Section</h3>
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-xs text-muted-foreground ml-1">Section Title</label>
                                <Input 
                                  placeholder="e.g. Living Room Murals, Abstract Canvas" 
                                  value={newSectionTitle} 
                                  onChange={(e) => setNewSectionTitle(e.target.value)} 
                                />
                              </div>
                              <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
                                <div className="space-y-1">
                                  <label className="text-xs text-muted-foreground ml-1">Sorting Order</label>
                                  <Input 
                                    type="number" 
                                    value={newSectionOrder} 
                                    onChange={(e) => setNewSectionOrder(parseInt(e.target.value) || 0)} 
                                  />
                                </div>
                                <div className="flex items-center gap-3 pt-5 px-1">
                                  <span className="text-xs text-muted-foreground">Live</span>
                                  <Switch checked={newSectionIsActive} onCheckedChange={setNewSectionIsActive} />
                                </div>
                              </div>
                              <Button 
                                variant="luxury" 
                                className="w-full mt-2" 
                                disabled={!newSectionTitle.trim() || isSaving}
                                onClick={async () => {
                                  setIsSaving(true);
                                  try {
                                    await addGallerySection({
                                      title: newSectionTitle,
                                      orderIndex: newSectionOrder,
                                      isActive: newSectionIsActive
                                    });
                                    setNewSectionTitle("");
                                    setNewSectionOrder(0);
                                    setNewSectionIsActive(true);
                                    toast.success("New gallery section created");
                                  } catch (err: any) {
                                    toast.error(err?.message ?? "Failed to create section");
                                  } finally {
                                    setIsSaving(false);
                                  }
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Section
                              </Button>
                            </div>
                          </div>

                          {/* Sections List */}
                          <div className="space-y-3">
                            <h3 className="text-sm font-semibold tracking-wider uppercase text-primary">All Sections</h3>
                            <div className="space-y-3">
                              {gallerySections.map((section) => {
                                const isEditingSection = editingSectionId === section.id;
                                const itemCount = gallery.filter(img => img.sectionId === section.id).length;
                                return (
                                  <Card key={section.id} className={`panel-luxury ${!section.isActive ? "opacity-60" : ""}`}>
                                    <CardContent className="p-4 space-y-3">
                                      {isEditingSection ? (
                                        <div className="space-y-3">
                                          <div className="space-y-1">
                                            <label className="text-xs font-semibold text-muted-foreground">Title</label>
                                            <Input 
                                              value={editingSectionTitle} 
                                              onChange={(e) => setEditingSectionTitle(e.target.value)} 
                                            />
                                          </div>
                                          <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
                                            <div className="space-y-1">
                                              <label className="text-xs font-semibold text-muted-foreground">Order</label>
                                              <Input 
                                                type="number" 
                                                value={editingSectionOrder} 
                                                onChange={(e) => setEditingSectionOrder(parseInt(e.target.value) || 0)} 
                                              />
                                            </div>
                                            <div className="flex items-center gap-2 pt-5">
                                              <span className="text-xs font-semibold">Live</span>
                                              <Switch checked={editingSectionIsActive} onCheckedChange={setEditingSectionIsActive} />
                                            </div>
                                          </div>
                                          <div className="flex justify-end gap-2 pt-1">
                                            <Button size="sm" variant="ghost" onClick={() => setEditingSectionId(null)}>Cancel</Button>
                                            <Button size="sm" variant="luxury" onClick={async () => {
                                              try {
                                                await updateGallerySection(section.id, {
                                                  title: editingSectionTitle,
                                                  orderIndex: editingSectionOrder,
                                                  isActive: editingSectionIsActive
                                                });
                                                setEditingSectionId(null);
                                                toast.success("Section updated");
                                              } catch (err: any) {
                                                toast.error(err?.message ?? "Update failed");
                                              }
                                            }}>Save</Button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-between gap-4">
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <h4 className="font-semibold text-sm">{section.title}</h4>
                                              <Badge variant={section.isActive ? "outline" : "secondary"} className="h-5 py-0 px-1 text-[9px]">
                                                {section.isActive ? "Live" : "Inactive"}
                                              </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                              {itemCount} {itemCount === 1 ? "artwork image" : "artwork images"} · Order index: {section.orderIndex}
                                            </p>
                                          </div>
                                          <div className="flex items-center gap-1 shrink-0">
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-8 w-8 text-primary" 
                                              onClick={() => {
                                                setEditingSectionId(section.id);
                                                setEditingSectionTitle(section.title);
                                                setEditingSectionOrder(section.orderIndex);
                                                setEditingSectionIsActive(section.isActive);
                                              }}
                                            >
                                              <FileText className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-8 w-8 text-destructive"
                                              onClick={async () => {
                                                if (confirm(`Are you sure you want to delete the section "${section.title}"? This will delete all ${itemCount} artwork images inside it.`)) {
                                                  try {
                                                    await deleteGallerySection(section.id);
                                                    if (selectedSectionId === section.id) {
                                                      setSelectedSectionId("");
                                                    }
                                                    toast.success("Section deleted successfully");
                                                  } catch (err: any) {
                                                    toast.error(err?.message ?? "Delete failed");
                                                  }
                                                }
                                              }}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                );
                              })}
                              {gallerySections.length === 0 && (
                                <div className="py-8 text-center text-xs text-muted-foreground border border-dashed rounded-2xl bg-canvas-texture/20">
                                  No gallery sections created yet. Use the form above to add one.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </ModuleShell>
                    </div>
                  </div>
                )}

                {currentSection === "profile" && profileDraft && (
                  <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <ModuleShell title="Admin Profile" description="Review and update your administrative profile details.">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-2">
                           {profileDraft.avatar ? (
                             <img src={profileDraft.avatar} alt="Avatar" className="h-20 w-20 rounded-full object-cover border-2 border-primary" />
                           ) : (
                             <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold">
                               {profileDraft.name.charAt(0)}
                             </div>
                           )}
                           <div className="space-y-2">
                              <Button variant="glass" size="sm" onClick={() => testimonialUploadRef.current?.click()}>
                                <UploadCloud className="h-4 w-4 mr-2" />
                                Upload New Avatar
                              </Button>
                              <input 
                                ref={testimonialUploadRef} 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={async (event) => handleSingleUpload(event, (url) => setProfileDraft(prev => prev ? ({ ...prev, avatar: url }) : null))} 
                              />
                           </div>
                        </div>
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Display Name</label>
                            <Input value={profileDraft.name || ""} onChange={(event) => setProfileDraft({ ...profileDraft, name: event.target.value })} placeholder="Name" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email Address</label>
                            <Input value={profileDraft.email || ""} onChange={(event) => setProfileDraft({ ...profileDraft, email: event.target.value })} placeholder="Email" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone Number</label>
                            <Input value={profileDraft.phone || ""} onChange={(event) => setProfileDraft({ ...profileDraft, phone: event.target.value })} placeholder="Phone number" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Permissions</label>
                            <Textarea
                              value={profileDraft.permissions.join(", ") || ""}
                              onChange={(event) => setProfileDraft({ ...profileDraft, permissions: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })}
                              className="min-h-[100px]"
                              placeholder="Comma-separated permissions"
                            />
                          </div>
                        </div>
                        <Button variant="luxury" className="w-full mt-4" onClick={() => updateProfile(profileDraft)}>
                          Save Profile Changes
                        </Button>
                      </div>
                    </ModuleShell>

                    <ModuleShell title="Profile Summary" description="Current admin session details and account status.">
                      <Card className="panel-luxury bg-canvas-texture">
                        <CardContent className="space-y-5 p-6">
                          <div className="flex items-center gap-4">
                            {user?.avatar ? (
                              <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
                            ) : (
                              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border/70 bg-card text-lg font-semibold">
                                {(user?.name || "A").slice(0, 1).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="text-xl font-semibold tracking-tight">{user?.name || "Admin"}</p>
                              <p className="text-sm text-muted-foreground">{user?.email || "admin@hyderabadwallarts.com"}</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <p>Role: {user?.role || "Administrator"}</p>
                            <p>Phone: {user?.phone || "+91 98490 11122"}</p>
                            <p>Status: {user?.accountStatus || "Active"}</p>
                            <p>Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString("en-IN") : "—"}</p>
                            <p>Permissions: {user?.permissions.join(", ") || "dashboard, content, settings"}</p>
                          </div>
                          <Button variant="outline" className="w-full justify-center" onClick={() => { logout(); navigate("/login"); }}>
                            Logout
                          </Button>
                        </CardContent>
                      </Card>
                    </ModuleShell>
                  </div>
                )}

                {currentSection === "services" && (
                  <ModuleShell title="Service Content Manager" description="Update titles, descriptions, and image sets for each service category.">
                    <div className="mb-6 flex justify-end">
                      <Button 
                        variant="luxury" 
                        onClick={async () => {
                          const newKey = `service-${Date.now()}`;
                          try {
                            await updateService(newKey as any, {
                              label: "New Service",
                              heroTitle: "New Service Title",
                              heroSubtitle: "New Service Subtitle",
                              whyChooseUs: [],
                              isActive: false,
                              category: "Home",
                              subcategory: "General",
                              description: "New service description",
                              images: [],
                              benefits: [],
                              relatedServices: []
                            });
                            toast.success("New service added successfully!");
                          } catch (err) {
                            toast.error("Failed to add service");
                            console.error(err);
                          }
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Service
                      </Button>
                    </div>
                    <div className="grid gap-5 xl:grid-cols-2">
                      {services.map((service) => {
                        const draft = serviceDrafts[service.key] || service;
                        return (
                          <Card key={service.key} className={`panel-luxury ${service.isActive ? "panel-active" : ""}`}>
                            <CardContent className="space-y-5 p-6">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Service Label</label>
                                    <Input value={draft.label || ""} onChange={(event) => setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, label: event.target.value } })} className="text-2xl font-semibold tracking-tight h-auto py-1" />
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">URL Path: /{service.key === "home" ? "" : service.key}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-muted-foreground">Live</span>
                                  <Switch checked={draft.isActive} onCheckedChange={(checked) => setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, isActive: checked } })} />
                                </div>
                              </div>

                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Hero Title</label>
                                  <Input value={draft.heroTitle || ""} onChange={(event) => setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, heroTitle: event.target.value } })} placeholder="Hero title" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Hero Subtitle</label>
                                  <Textarea value={draft.heroSubtitle || ""} onChange={(event) => setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, heroSubtitle: event.target.value } })} placeholder="Hero subtitle" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Detailed Description</label>
                                  <Textarea value={draft.description || ""} onChange={(event) => setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, description: event.target.value } })} placeholder="Service description" />
                                </div>
                                
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Category</label>
                                    <Select value={draft.category} onValueChange={(value: "Home" | "Commercial") => setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, category: value } })}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Home">Home</SelectItem>
                                        <SelectItem value="Commercial">Commercial</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Subcategory</label>
                                    <Input value={draft.subcategory || ""} onChange={(event) => setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, subcategory: event.target.value } })} placeholder="Subcategory" />
                                  </div>
                                </div>

                                <div className="space-y-3 rounded-2xl border border-border/70 bg-canvas-texture p-4">
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Service images</p>
                                    <Button variant="glass" size="sm" onClick={() => serviceUploadRefs.current[service.key]?.click()}>
                                      <UploadCloud className="h-4 w-4 mr-2" />
                                      Upload
                                    </Button>
                                    <input
                                      ref={(node) => {
                                        serviceUploadRefs.current[service.key] = node;
                                      }}
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={async (event) => handleSingleUpload(event, (value) => setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, images: [...(draft.images || []), value] } }))}
                                    />
                                  </div>
                                  <div className="flex flex-wrap gap-3">
                                    {(draft.images || []).map((img: string, idx: number) => (
                                      <div key={`${service.key}-img-${idx}`} className="relative group aspect-square w-24 rounded-lg overflow-hidden border border-border/70 shadow-sm">
                                        <img src={img} alt={`Service image ${idx}`} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <Button 
                                            variant="destructive" 
                                            size="icon" 
                                            className="h-7 w-7"
                                            onClick={() => {
                                              const newImages = (draft.images || []).filter((_: any, i: number) => i !== idx);
                                              setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, images: newImages } });
                                            }}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                    {(!draft.images || draft.images.length === 0) && (
                                      <div className="flex h-24 w-full items-center justify-center rounded-lg border border-dashed border-border/70 text-xs text-muted-foreground">
                                        No images uploaded
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Why choose us</p>
                                  <Button variant="glass" size="sm" onClick={() => setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, whyChooseUs: [...(draft.whyChooseUs || []), "New point..."] } })}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add point
                                  </Button>
                                </div>
                                <div className="space-y-3">
                                  {(draft.whyChooseUs || []).map((point: string, index: number) => (
                                    <div key={`${service.key}-${index}`} className="flex items-start gap-3">
                                      <Textarea 
                                        value={point || ""} 
                                        onChange={(event) => {
                                          const newPoints = [...draft.whyChooseUs];
                                          newPoints[index] = event.target.value;
                                          setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, whyChooseUs: newPoints } });
                                        }} 
                                        className="min-h-[84px]" 
                                      />
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => {
                                          const newPoints = draft.whyChooseUs.filter((_: any, i: number) => i !== index);
                                          setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, whyChooseUs: newPoints } });
                                        }} 
                                        aria-label="Remove point"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Benefits</p>
                                  <Button variant="glass" size="sm" onClick={() => setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, benefits: [...(draft.benefits || []), "New benefit..."] } })}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add benefit
                                  </Button>
                                </div>
                                <div className="space-y-3">
                                  {(draft.benefits || []).map((point: string, index: number) => (
                                    <div key={`${service.key}-benefit-${index}`} className="flex items-start gap-3">
                                      <Textarea 
                                        value={point || ""} 
                                        onChange={(event) => {
                                          const newPoints = [...(draft.benefits || [])];
                                          newPoints[index] = event.target.value;
                                          setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, benefits: newPoints } });
                                        }} 
                                        className="min-h-[60px]" 
                                      />
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => {
                                          const newPoints = (draft.benefits || []).filter((_: any, i: number) => i !== index);
                                          setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, benefits: newPoints } });
                                        }} 
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Related Services</p>
                                  <Button variant="glass" size="sm" onClick={() => setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, relatedServices: [...(draft.relatedServices || []), { label: "New Service", to: "/" }] } })}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add link
                                  </Button>
                                </div>
                                <div className="space-y-3">
                                  {(draft.relatedServices || []).map((rel: any, index: number) => (
                                    <div key={`${service.key}-rel-${index}`} className="grid grid-cols-[1fr_1fr_auto] gap-3 p-3 rounded-xl border border-border/50 bg-secondary/30">
                                      <Input 
                                        value={rel.label || ""} 
                                        placeholder="Label"
                                        onChange={(event) => {
                                          const newRel = [...(draft.relatedServices || [])];
                                          newRel[index] = { ...rel, label: event.target.value };
                                          setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, relatedServices: newRel } });
                                        }}
                                      />
                                      <Input 
                                        value={rel.to || ""} 
                                        placeholder="/path"
                                        onChange={(event) => {
                                          const newRel = [...(draft.relatedServices || [])];
                                          newRel[index] = { ...rel, to: event.target.value };
                                          setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, relatedServices: newRel } });
                                        }}
                                      />
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => {
                                          const newRel = (draft.relatedServices || []).filter((_: any, i: number) => i !== index);
                                          setServiceDrafts({ ...serviceDrafts, [service.key]: { ...draft, relatedServices: newRel } });
                                        }} 
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <Button 
                                variant="luxury" 
                                className="w-full mt-4" 
                                disabled={isSaving}
                                onClick={async () => {
                                  setIsSaving(true);
                                  try {
                                    await updateService(service.key, draft);
                                    setFeedback({
                                      open: true,
                                      type: "success",
                                      title: "Service Updated",
                                      message: "The service information and images have been saved."
                                    });
                                  } catch (err) {
                                    setFeedback({
                                      open: true,
                                      type: "error",
                                      title: "Save Error",
                                      message: "We couldn't save the service changes. Please check your connection."
                                    });
                                  } finally {
                                    setIsSaving(false);
                                  }
                                }}
                              >
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Update {service.label} Service
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </ModuleShell>
                )}

                {currentSection === "blogs" && (
                  <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <ModuleShell title="Blogs" description="Simulate rich text with formatting helpers, image uploads, category organization, and public inner pages.">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="glass" size="sm" onClick={() => setBlogDraft((draft) => ({ ...draft, content: appendSnippet(draft.content, "## New section heading") }))}>H2</Button>
                          <Button variant="glass" size="sm" onClick={() => setBlogDraft((draft) => ({ ...draft, content: appendSnippet(draft.content, "### Supporting subheading") }))}>H3</Button>
                          <Button variant="glass" size="sm" onClick={() => setBlogDraft((draft) => ({ ...draft, content: appendSnippet(draft.content, "**Bold highlight**") }))}>
                            <Bold className="h-4 w-4" />
                            Bold
                          </Button>
                          <Button variant="glass" size="sm" onClick={() => setBlogDraft((draft) => ({ ...draft, content: appendSnippet(draft.content, "- First point\n- Second point") }))}>
                            <List className="h-4 w-4" />
                            List
                          </Button>
                        </div>
                        <Input value={blogDraft.title || ""} onChange={(event) => setBlogDraft((draft) => ({ ...draft, title: event.target.value }))} placeholder="Blog title" />
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Slug: {slugify(blogDraft.title || "untitled-post")}</p>
                        <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
                          <Select value={blogDraft.category} onValueChange={(value: BlogCategory) => setBlogDraft((draft) => ({ ...draft, category: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {(["Design Tips", "Process", "Case Studies"] as BlogCategory[]).map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input value={blogDraft.category || ""} onChange={(event) => setBlogDraft((draft) => ({ ...draft, category: event.target.value }))} placeholder="Category" />
                        </div>
                        <Textarea value={blogDraft.excerpt || ""} onChange={(event) => setBlogDraft((draft) => ({ ...draft, excerpt: event.target.value }))} placeholder="Short excerpt" />
                        <div className="flex gap-3">
                          <Input value={blogDraft.image || ""} onChange={(event) => setBlogDraft((draft) => ({ ...draft, image: event.target.value }))} placeholder="Main image URL or base64" />
                          <Button variant="glass" onClick={() => blogUploadRef.current?.click()}>
                            <UploadCloud className="h-4 w-4" />
                            Upload
                          </Button>
                          <input ref={blogUploadRef} type="file" accept="image/*" className="hidden" onChange={async (event) => handleSingleUpload(event, (value) => setBlogDraft((draft) => ({ ...draft, image: value })))} />
                        </div>
                        <Textarea value={blogDraft.content || ""} onChange={(event) => setBlogDraft((draft) => ({ ...draft, content: event.target.value }))} className="min-h-[400px]" placeholder="Blog content (Markdown supported)" />
                        
                        <div className="space-y-3 rounded-2xl border border-border/70 bg-canvas-texture p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Related Work Gallery</p>
                            <Button variant="glass" size="sm" onClick={() => blogGalleryUploadRef.current?.click()}>
                              <UploadCloud className="h-4 w-4 mr-2" />
                              Upload Works
                            </Button>
                            <input 
                              ref={blogGalleryUploadRef} 
                              type="file" 
                              multiple 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleMultipleUpload(e, (urls) => setBlogDraft(d => ({ ...d, gallery_images: [...(d.gallery_images || []), ...urls] })))} 
                            />
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {(blogDraft.gallery_images || []).map((img, idx) => (
                              <div key={`blog-gal-${idx}`} className="relative group aspect-square w-20 rounded-lg overflow-hidden border border-border/70">
                                <img src={img} alt="" className="h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button 
                                    variant="destructive" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => setBlogDraft(d => ({ ...d, gallery_images: d.gallery_images.filter((_, i) => i !== idx) }))}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                            {(!blogDraft.gallery_images || blogDraft.gallery_images.length === 0) && (
                              <div className="flex h-20 w-full items-center justify-center rounded-lg border border-dashed border-border/70 text-[10px] text-muted-foreground">
                                No related work images
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap justify-between gap-3">
                          <Button variant="outline" onClick={() => setBlogDraft(emptyBlogDraft)}>Clear</Button>
                          <Button variant="luxury" onClick={async () => {
                            setIsSaving(true);
                            try {
                              await saveBlogDraft();
                              setFeedback({
                                open: true,
                                type: "success",
                                title: blogDraft.id ? "Blog Updated" : "Blog Published",
                                message: `The blog post "${blogDraft.title}" has been successfully ${blogDraft.id ? "updated" : "published"}.`
                              });
                            } catch (err) {
                              setFeedback({
                                open: true,
                                type: "error",
                                title: "Action Failed",
                                message: "We couldn't save your blog post. Please check your data."
                              });
                            } finally {
                              setIsSaving(false);
                            }
                          }} disabled={isSaving}>
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {blogDraft.id ? "Update post" : "Publish post"}
                          </Button>
                        </div>
                      </div>
                    </ModuleShell>

                    <div className="space-y-6">
                      <ModuleShell title="Preview" description="Simple rich-text rendering for headings, bold text, and lists.">
                        <div className="space-y-3 rounded-2xl border border-border/70 bg-canvas-texture p-5">
                          {blogDraft.image ? (
                            <div className="overflow-hidden rounded-2xl border border-border/70">
                              <img src={blogDraft.image} alt={blogDraft.title || "Blog preview"} className="aspect-[16/9] h-full w-full object-cover" />
                            </div>
                          ) : null}
                          <Badge variant="secondary">{blogDraft.category}</Badge>
                          <h3 className="text-2xl font-semibold tracking-tight">{blogDraft.title || "Untitled post"}</h3>
                          <p className="text-sm leading-7 text-muted-foreground">{blogDraft.excerpt || "Add an excerpt to summarize the story."}</p>
                          <div className="space-y-3">{renderRichText(blogDraft.content || "## Content preview\nAdd blog body text to see formatted headings, lists, and bold highlights.")}</div>
                        </div>
                      </ModuleShell>

                      <ModuleShell title="Saved posts" description="Edit or remove published posts from the same module.">
                        <div className="space-y-3">
                          {blogPosts.map((post: BlogPost) => (
                            <Card key={post.id} className="panel-luxury overflow-hidden">
                              {post.image ? (
                                <div className="aspect-[16/8] overflow-hidden border-b border-border/70">
                                  <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                                </div>
                              ) : null}
                              <CardContent className="space-y-3 p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <Badge variant="outline">{post.category}</Badge>
                                    <p className="mt-2 font-semibold tracking-tight">{post.title}</p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">/blogs/{post.slug}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => setBlogDraft({ id: post.id, title: post.title, category: post.category, excerpt: post.excerpt, content: post.content, image: post.image, gallery_images: post.gallery_images || [] })} aria-label="Edit post">
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => deleteBlogPost(post.id)} aria-label="Delete post">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ModuleShell>
                    </div>
                  </div>
                )}

                {currentSection === "categories" && (
                  <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <ModuleShell title="Wallpaper Categories" description="Add, edit, and remove wallpaper categories without changing the existing public filter layout.">
                      <div className="space-y-4">
                        <Input value={categoryDraft.name || ""} onChange={(event) => setCategoryDraft((draft) => ({ ...draft, name: event.target.value }))} placeholder="Category name" />
                        <div className="flex gap-3">
                          <Input value={categoryDraft.image || ""} onChange={(event) => setCategoryDraft((draft) => ({ ...draft, image: event.target.value }))} placeholder="Image URL or base64" />
                          <Button variant="glass" onClick={() => categoryUploadRef.current?.click()}>
                            <UploadCloud className="h-4 w-4" />
                            Upload
                          </Button>
                          <input ref={categoryUploadRef} type="file" accept="image/*" className="hidden" onChange={async (event) => handleSingleUpload(event, (value) => setCategoryDraft((draft) => ({ ...draft, image: value })))} />
                        </div>
                        <Textarea value={categoryDraft.description || ""} onChange={(event) => setCategoryDraft((draft) => ({ ...draft, description: event.target.value }))} className="min-h-[180px]" placeholder="Description" />
                        <div className="flex flex-wrap justify-between gap-3">
                          <Button variant="outline" onClick={() => setCategoryDraft(emptyCategoryDraft)}>Clear</Button>
                          <Button variant="luxury" onClick={async () => {
                            setIsSaving(true);
                            try {
                              await saveCategoryDraft();
                              setFeedback({
                                open: true,
                                type: "success",
                                title: categoryDraft.id ? "Category Updated" : "Category Added",
                                message: "Wallpaper category changes have been applied."
                              });
                            } catch (err) {
                              setFeedback({
                                open: true,
                                type: "error",
                                title: "Save Error",
                                message: "Failed to update wallpaper categories."
                              });
                            } finally {
                              setIsSaving(false);
                            }
                          }} disabled={isSaving}>
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {categoryDraft.id ? "Update category" : "Add category"}
                          </Button>
                        </div>
                      </div>
                    </ModuleShell>

                    <ModuleShell title="Saved categories" description="These records power the home-page category filters.">
                      <div className="space-y-3">
                        {categories.map((category) => (
                          <Card key={category.id} className="panel-luxury overflow-hidden">
                            <div className="grid gap-4 p-4 lg:grid-cols-[120px_1fr]">
                              <div className="overflow-hidden rounded-2xl border border-border/70">
                                <img src={category.image} alt={category.name} className="aspect-square h-full w-full object-cover" />
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="font-semibold tracking-tight">{category.name}</p>
                                    <p className="text-sm text-muted-foreground">{category.description}</p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => setCategoryDraft(category)} aria-label="Edit category">
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => deleteCategory(category.id)} aria-label="Delete category">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ModuleShell>
                  </div>
                )}

                {currentSection === "videos" && (
                  <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <ModuleShell title="Videos" description="Manage video cards that appear on the home page using the existing UI language.">
                      <div className="space-y-4">
                        <Input value={videoDraft.title || ""} onChange={(event) => setVideoDraft((draft) => ({ ...draft, title: event.target.value }))} placeholder="Video title" />
                        <div className="flex gap-3">
                          <Input value={videoDraft.thumbnail || ""} onChange={(event) => setVideoDraft((draft) => ({ ...draft, thumbnail: event.target.value }))} placeholder="Thumbnail URL or base64" />
                          <Button variant="glass" onClick={() => videoUploadRef.current?.click()}>
                            <UploadCloud className="h-4 w-4" />
                            Upload
                          </Button>
                          <input ref={videoUploadRef} type="file" accept="image/*" className="hidden" onChange={async (event) => handleSingleUpload(event, (value) => setVideoDraft((draft) => ({ ...draft, thumbnail: value })))} />
                        </div>
                        <div className="flex gap-3">
                          <Input value={videoDraft.videoUrl || ""} onChange={(event) => setVideoDraft((draft) => ({ ...draft, videoUrl: event.target.value }))} placeholder="YouTube or file URL" />
                          <Button variant="glass" onClick={() => videoFileRef.current?.click()}>
                            <UploadCloud className="h-4 w-4" />
                            Upload Video
                          </Button>
                          <input 
                            ref={videoFileRef} 
                            type="file" 
                            accept="video/*" 
                            className="hidden" 
                            onChange={async (event) => 
                              handleSingleUpload(event, (url) => setVideoDraft((draft) => ({ ...draft, videoUrl: url })), "video")
                            } 
                          />
                        </div>
                        <Select value={videoDraft.category} onValueChange={(value: VideoCategory) => setVideoDraft((draft) => ({ ...draft, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {videoCategories.map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap justify-between gap-3">
                          <Button variant="outline" onClick={() => setVideoDraft(emptyVideoDraft)}>Clear</Button>
                          <Button variant="luxury" onClick={async () => {
                            setIsSaving(true);
                            try {
                              await saveVideoDraft();
                              setFeedback({
                                open: true,
                                type: "success",
                                title: videoDraft.id ? "Video Updated" : "Video Added",
                                message: "Video library changes have been saved."
                              });
                            } catch (err) {
                              setFeedback({
                                open: true,
                                type: "error",
                                title: "Save Error",
                                message: "Failed to update video record."
                              });
                            } finally {
                              setIsSaving(false);
                            }
                          }} disabled={isSaving}>
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {videoDraft.id ? "Update video" : "Add video"}
                          </Button>
                        </div>
                      </div>
                    </ModuleShell>

                    <ModuleShell title="Saved videos" description="Click targets open the configured video URL on the public site.">
                      <div className="space-y-3">
                        {videos.map((video) => (
                          <Card key={video.id} className="panel-luxury overflow-hidden border-border/50">
                            <div className="flex flex-col md:flex-row gap-4 p-4">
                              {/* Thumbnail Container */}
                              <div className="relative w-full md:w-[200px] shrink-0 overflow-hidden rounded-xl border border-border/70 group cursor-pointer bg-secondary/30" onClick={() => video.videoUrl && setPreviewVideo(video.videoUrl)}>
                                {video.thumbnail ? (
                                  <img src={video.thumbnail} alt={video.title} className="aspect-video h-full w-full object-cover group-hover:scale-105 transition-transform" />
                                ) : (
                                  <div className="aspect-video flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                    <Video className="h-6 w-6 opacity-20" />
                                    <span className="text-[10px] uppercase tracking-wider">No Thumbnail</span>
                                  </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md shadow-xl group-hover:scale-110 transition-transform">
                                    <Play className="h-4 w-4 text-white fill-white" />
                                  </div>
                                </div>
                              </div>

                              {/* Content Info */}
                              <div className="flex flex-1 flex-col justify-between min-w-0 py-1">
                                <div className="space-y-2">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-semibold tracking-tight text-foreground truncate">{video.title}</h4>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 uppercase tracking-wider">{video.category}</Badge>
                                        <p className={`text-[11px] truncate ${!video.videoUrl ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                                          {video.videoUrl ? (video.videoUrl.startsWith("data:") ? "Direct Upload (Base64)" : video.videoUrl) : "⚠ Missing Video Data"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/30">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 gap-2 bg-secondary/30 hover:bg-primary hover:text-white transition-all"
                                    onClick={() => setVideoDraft(video)}
                                  >
                                    <FileText className="h-3.5 w-3.5" />
                                    Edit Details
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 gap-2 bg-destructive/5 text-destructive border-destructive/20 hover:bg-destructive hover:text-white transition-all"
                                    onClick={() => deleteVideo(video.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ModuleShell>
                  </div>
                )}

                {currentSection === "pages" && pagesDraft && (
                  <div className="grid gap-6 xl:grid-cols-3">
                    <ModuleShell title="Home page" description="Control the home hero title, hero images, and section visibility.">
                      <div className="space-y-4">
                        {/* Hero Slides Section */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Hero Slides</label>
                             <Button variant="glass" size="sm" onClick={() => homeUploadRef.current?.click()}>
                               <UploadCloud className="h-4 w-4 mr-2" />
                               Add Slide
                             </Button>
                             <input ref={homeUploadRef} type="file" accept="image/*" className="hidden" onChange={async (event) => {
                               const file = event.target.files?.[0];
                               if (!file) return;
                               setIsUploading(true);
                               try {
                                 const url = await uploadToCloudinary(file, "image");
                                 setPagesDraft({ ...pagesDraft, home: { ...pagesDraft.home, heroSlides: [...(pagesDraft.home.heroSlides || []), { image: url, title: "Artistic Excellence", subtitle: "Transforming spaces since 2000" }] } });
                                 toast.success("Slide image uploaded to Cloudinary");
                               } catch (err: any) {
                                 toast.error(err?.message ?? "Upload failed");
                               } finally {
                                 setIsUploading(false);
                                 (event.target as HTMLInputElement).value = "";
                               }
                             }} />
                          </div>
                          
                          <div className="space-y-3">
                            {(pagesDraft.home.heroSlides || []).map((slide: any, idx: number) => (
                              <Card key={idx} className="p-3 border-border/50 bg-secondary/10 relative group">
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-10" 
                                  onClick={() => {
                                    const newSlides = [...pagesDraft.home.heroSlides];
                                    newSlides.splice(idx, 1);
                                    setPagesDraft({ ...pagesDraft, home: { ...pagesDraft.home, heroSlides: newSlides } });
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <div className="flex flex-col md:flex-row gap-4">
                                  <div className="w-full md:w-32 h-20 rounded-lg overflow-hidden border border-border/50 bg-black/20 shrink-0">
                                    <img src={slide.image} alt="Slide preview" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <Input 
                                      value={slide.title} 
                                      onChange={(e) => {
                                        const newSlides = [...pagesDraft.home.heroSlides];
                                        newSlides[idx].title = e.target.value;
                                        setPagesDraft({ ...pagesDraft, home: { ...pagesDraft.home, heroSlides: newSlides } });
                                      }} 
                                      placeholder="Main Heading (Title)" 
                                      className="h-8 font-bold"
                                    />
                                    <Input 
                                      value={slide.subtitle} 
                                      onChange={(e) => {
                                        const newSlides = [...pagesDraft.home.heroSlides];
                                        newSlides[idx].subtitle = e.target.value;
                                        setPagesDraft({ ...pagesDraft, home: { ...pagesDraft.home, heroSlides: newSlides } });
                                      }} 
                                      placeholder="Sub-heading (Message)" 
                                      className="h-8 text-xs"
                                    />
                                  </div>
                                </div>
                              </Card>
                            ))}
                            {(!pagesDraft.home.heroSlides || pagesDraft.home.heroSlides.length === 0) && (
                              <div className="text-center py-8 rounded-xl border border-dashed border-border text-muted-foreground text-sm">
                                No slides added yet. Click 'Add Slide' to start.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Separator */}
                        <div className="h-px bg-border/50 my-4" />

                        <div className="space-y-3 pt-2">
                           <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Why Choose Us Points</label>
                           {(pagesDraft.home.whyChooseUs || []).map((point: any, idx: number) => (
                             <div key={idx} className="space-y-2 p-3 rounded-lg border border-border bg-secondary/20 relative group">
                               <Button 
                                 variant="ghost" 
                                 size="icon" 
                                 className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
                                 onClick={() => {
                                   const newPoints = [...pagesDraft.home.whyChooseUs];
                                   newPoints.splice(idx, 1);
                                   setPagesDraft({ ...pagesDraft, home: { ...pagesDraft.home, whyChooseUs: newPoints } });
                                 }}
                               >
                                 <Trash2 className="h-3 w-3 text-destructive" />
                               </Button>
                               <div className="grid grid-cols-[40px_1fr] gap-2">
                                 <Input value={point.icon} onChange={(e) => {
                                   const newPoints = [...pagesDraft.home.whyChooseUs];
                                   newPoints[idx].icon = e.target.value;
                                   setPagesDraft({ ...pagesDraft, home: { ...pagesDraft.home, whyChooseUs: newPoints } });
                                 }} placeholder="Icon (emoji)" />
                                 <Input value={point.title} onChange={(e) => {
                                   const newPoints = [...pagesDraft.home.whyChooseUs];
                                   newPoints[idx].title = e.target.value;
                                   setPagesDraft({ ...pagesDraft, home: { ...pagesDraft.home, whyChooseUs: newPoints } });
                                 }} placeholder="Title" />
                               </div>
                               <Input value={point.desc} onChange={(e) => {
                                 const newPoints = [...pagesDraft.home.whyChooseUs];
                                 newPoints[idx].desc = e.target.value;
                                 setPagesDraft({ ...pagesDraft, home: { ...pagesDraft.home, whyChooseUs: newPoints } });
                               }} placeholder="Description" className="text-xs" />
                             </div>
                           ))}
                           <Button variant="outline" size="sm" className="w-full text-[10px] uppercase tracking-tighter h-8" onClick={() => setPagesDraft({ ...pagesDraft, home: { ...pagesDraft.home, whyChooseUs: [...(pagesDraft.home.whyChooseUs || []), { icon: "✨", title: "New Point", desc: "Short description" }] } })}>
                             <Plus className="h-3 w-3 mr-1" /> Add Point
                           </Button>
                        </div>

                        <div className="space-y-3 pt-2">
                           <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Stats</label>
                           <div className="grid grid-cols-2 gap-2">
                             {(pagesDraft.home.stats || []).map((stat: any, idx: number) => (
                               <div key={idx} className="space-y-1 p-2 rounded-lg border border-border bg-secondary/10 relative group">
                                 <Button 
                                   variant="ghost" 
                                   size="icon" 
                                   className="absolute -top-1 -right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" 
                                   onClick={() => {
                                     const newStats = [...pagesDraft.home.stats];
                                     newStats.splice(idx, 1);
                                     setPagesDraft({ ...pagesDraft, home: { ...pagesDraft.home, stats: newStats } });
                                   }}
                                 >
                                   <X className="h-3 w-3" />
                                 </Button>
                                 <Input value={stat.num} onChange={(e) => {
                                   const newStats = [...pagesDraft.home.stats];
                                   newStats[idx].num = e.target.value;
                                   setPagesDraft({ ...pagesDraft, home: { ...pagesDraft.home, stats: newStats } });
                                 }} placeholder="500+" className="h-7 text-xs font-bold" />
                                 <Input value={stat.label} onChange={(e) => {
                                   const newStats = [...pagesDraft.home.stats];
                                   newStats[idx].label = e.target.value;
                                   setPagesDraft({ ...pagesDraft, home: { ...pagesDraft.home, stats: newStats } });
                                 }} placeholder="Label" className="h-7 text-[10px]" />
                               </div>
                             ))}
                             <Button variant="outline" size="sm" className="h-full min-h-[60px] text-[10px]" onClick={() => setPagesDraft({ ...pagesDraft, home: { ...pagesDraft.home, stats: [...(pagesDraft.home.stats || []), { num: "0", label: "New Stat" }] } })}>
                               <Plus className="h-3 w-3" />
                             </Button>
                           </div>
                        </div>
                        <Button 
                          variant="luxury" 
                          className="w-full" 
                          disabled={isSaving}
                          onClick={async () => {
                            setIsSaving(true);
                            try {
                              await updateHomePage(pagesDraft.home);
                              setFeedback({
                                open: true,
                                type: "success",
                                title: "Home Page Saved",
                                message: "Home page hero slides, points, and stats updated."
                              });
                            } catch (err) {
                              setFeedback({
                                open: true,
                                type: "error",
                                title: "Save Error",
                                message: "Failed to update home page configuration."
                              });
                            } finally {
                              setIsSaving(false);
                            }
                          }}
                        >
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Save Home Page
                        </Button>
                      </div>
                    </ModuleShell>

                    <ModuleShell title="About page" description="Edit the about narrative and founder profile.">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Page Title</label>
                          <Input value={pagesDraft.about.title || ""} onChange={(event) => setPagesDraft({ ...pagesDraft, about: { ...pagesDraft.about, title: event.target.value } })} placeholder="About page title" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Main Content</label>
                          <Textarea value={pagesDraft.about.content || ""} onChange={(event) => setPagesDraft({ ...pagesDraft, about: { ...pagesDraft.about, content: event.target.value } })} className="min-h-[180px]" placeholder="Rich text content" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Founder Name</label>
                          <Input value={pagesDraft.about.founderName || ""} onChange={(event) => setPagesDraft({ ...pagesDraft, about: { ...pagesDraft.about, founderName: event.target.value } })} placeholder="Founder name" />
                        </div>
                        <div className="space-y-3">
                           <div className="flex items-center justify-between">
                              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Founder Image</label>
                              <Button variant="glass" size="sm" onClick={() => aboutUploadRef.current?.click()}>
                                <UploadCloud className="h-4 w-4 mr-2" />
                                Upload
                              </Button>
                              <input ref={aboutUploadRef} type="file" accept="image/*" className="hidden" onChange={async (event) => handleSingleUpload(event, (value) => setPagesDraft({ ...pagesDraft, about: { ...pagesDraft.about, founderImage: value } }))} />
                           </div>
                           <Input value={pagesDraft.about.founderImage || ""} onChange={(event) => setPagesDraft({ ...pagesDraft, about: { ...pagesDraft.about, founderImage: event.target.value } })} placeholder="Founder image URL" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Founder Description</label>
                          <Textarea value={pagesDraft.about.founderDescription || ""} onChange={(event) => setPagesDraft({ ...pagesDraft, about: { ...pagesDraft.about, founderDescription: event.target.value } })} className="min-h-[120px]" placeholder="Description about founder" />
                        </div>

                        <div className="space-y-3 pt-2">
                           <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Expertise / Skills</label>
                           {(pagesDraft.about.expertise || []).map((skill: any, idx: number) => (
                             <div key={idx} className="flex gap-2 items-center p-2 rounded-lg border border-border bg-secondary/10 group relative">
                               <Input value={skill.name} onChange={(e) => {
                                 const newSkills = [...pagesDraft.about.expertise];
                                 newSkills[idx].name = e.target.value;
                                 setPagesDraft({ ...pagesDraft, about: { ...pagesDraft.about, expertise: newSkills } });
                               }} placeholder="Skill name" className="flex-1 h-8 text-xs" />
                               <Input type="number" value={skill.pct} onChange={(e) => {
                                 const newSkills = [...pagesDraft.about.expertise];
                                 newSkills[idx].pct = parseInt(e.target.value);
                                 setPagesDraft({ ...pagesDraft, about: { ...pagesDraft.about, expertise: newSkills } });
                               }} placeholder="%" className="w-16 h-8 text-xs" />
                               <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => {
                                 const newSkills = [...pagesDraft.about.expertise];
                                 newSkills.splice(idx, 1);
                                 setPagesDraft({ ...pagesDraft, about: { ...pagesDraft.about, expertise: newSkills } });
                               }}>
                                 <X className="h-3 w-3" />
                               </Button>
                             </div>
                           ))}
                           <Button variant="outline" size="sm" className="w-full text-[10px] h-8" onClick={() => setPagesDraft({ ...pagesDraft, about: { ...pagesDraft.about, expertise: [...(pagesDraft.about.expertise || []), { name: "Skill", pct: 80 }] } })}>
                             <Plus className="h-3 w-3 mr-1" /> Add Skill
                           </Button>
                        </div>
                        <Button 
                          variant="luxury" 
                          className="w-full" 
                          disabled={isSaving}
                          onClick={async () => {
                            setIsSaving(true);
                            try {
                              await updateAboutPage(pagesDraft.about);
                              setFeedback({
                                open: true,
                                type: "success",
                                title: "About Page Saved",
                                message: "About page details updated."
                              });
                            } catch (err) {
                              setFeedback({
                                open: true,
                                type: "error",
                                title: "Save Error",
                                message: "Failed to update about page configuration."
                              });
                            } finally {
                              setIsSaving(false);
                            }
                          }}
                        >
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Save About Page
                        </Button>
                      </div>
                    </ModuleShell>

                    <ModuleShell title="Contact page" description="Manage public contact details and map integration.">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone Number</label>
                          <Input value={pagesDraft.contact.phone || ""} onChange={(event) => setPagesDraft({ ...pagesDraft, contact: { ...pagesDraft.contact, phone: event.target.value } })} placeholder="Phone" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email Address</label>
                          <Input value={pagesDraft.contact.email || ""} onChange={(event) => setPagesDraft({ ...pagesDraft, contact: { ...pagesDraft.contact, email: event.target.value } })} placeholder="Email" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Office Address</label>
                          <Textarea value={pagesDraft.contact.address || ""} onChange={(event) => setPagesDraft({ ...pagesDraft, contact: { ...pagesDraft.contact, address: event.target.value } })} className="min-h-[100px]" placeholder="Address" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">WhatsApp Link</label>
                          <Input value={pagesDraft.contact.whatsapp || ""} onChange={(event) => setPagesDraft({ ...pagesDraft, contact: { ...pagesDraft.contact, whatsapp: event.target.value } })} placeholder="WhatsApp Link" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Map Embed URL</label>
                          <Input value={pagesDraft.contact.mapEmbed || ""} onChange={(event) => setPagesDraft({ ...pagesDraft, contact: { ...pagesDraft.contact, mapEmbed: event.target.value } })} placeholder="Google Maps iframe src URL" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Working Hours</label>
                          <Input value={pagesDraft.contact.workingHours || ""} onChange={(event) => setPagesDraft({ ...pagesDraft, contact: { ...pagesDraft.contact, workingHours: event.target.value } })} placeholder="Mon - Sat: 9AM - 7PM" />
                        </div>
                        <Button 
                          variant="luxury" 
                          className="w-full" 
                          disabled={isSaving}
                          onClick={async () => {
                            setIsSaving(true);
                            try {
                              await updateContactPage(pagesDraft.contact);
                              setFeedback({
                                open: true,
                                type: "success",
                                title: "Contact Page Saved",
                                message: "Contact information updated."
                              });
                            } catch (err) {
                              setFeedback({
                                open: true,
                                type: "error",
                                title: "Save Error",
                                message: "Failed to update contact page."
                              });
                            } finally {
                              setIsSaving(false);
                            }
                          }}
                        >
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Save Contact Page
                        </Button>
                      </div>
                    </ModuleShell>
                  </div>
                )}

                {currentSection === "testimonials" && (
                  <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <ModuleShell title="Testimonials" description="Manage testimonial cards with stars, quote, and avatar or initials.">
                      <div className="space-y-4">
                        <Input value={testimonialDraft.name || ""} onChange={(event) => setTestimonialDraft((draft) => ({ ...draft, name: event.target.value }))} placeholder="Client name" />
                        <div className="space-y-3">
                          <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Rating</p>
                          <Slider value={[testimonialDraft.rating]} min={1} max={5} step={1} onValueChange={(value) => setTestimonialDraft((draft) => ({ ...draft, rating: value[0] ?? 5 }))} />
                          <div className="flex items-center gap-1">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-4 w-4 ${index < testimonialDraft.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />)}</div>
                        </div>
                        <div className="flex gap-3">
                          <Input value={testimonialDraft.image || ""} onChange={(event) => setTestimonialDraft((draft) => ({ ...draft, image: event.target.value }))} placeholder="Avatar URL or base64" />
                          <Button variant="glass" onClick={() => testimonialUploadRef.current?.click()}>
                            <UploadCloud className="h-4 w-4" />
                            Upload
                          </Button>
                          <input ref={testimonialUploadRef} type="file" accept="image/*" className="hidden" onChange={async (event) => handleSingleUpload(event, (value) => setTestimonialDraft((draft) => ({ ...draft, image: value })))} />
                        </div>
                        <Textarea value={testimonialDraft.message || ""} onChange={(event) => setTestimonialDraft((draft) => ({ ...draft, message: event.target.value }))} className="min-h-[180px]" placeholder="Testimonial message" />
                        <div className="flex flex-wrap justify-between gap-3">
                          <Button variant="outline" onClick={() => setTestimonialDraft(emptyTestimonialDraft)}>Clear</Button>
                          <Button variant="luxury" onClick={async () => {
                            setIsSaving(true);
                            try {
                              await saveTestimonialDraft();
                              setFeedback({
                                open: true,
                                type: "success",
                                title: testimonialDraft.id ? "Testimonial Updated" : "Testimonial Added",
                                message: "Testimonial records have been updated."
                              });
                            } catch (err) {
                              setFeedback({
                                open: true,
                                type: "error",
                                title: "Save Error",
                                message: "Failed to update testimonial record."
                              });
                            } finally {
                              setIsSaving(false);
                            }
                          }} disabled={isSaving}>
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {testimonialDraft.id ? "Update testimonial" : "Add testimonial"}
                          </Button>
                        </div>
                      </div>
                    </ModuleShell>

                    <ModuleShell title="Saved testimonials" description="Frontend cards use the same content with stars, quote treatment, and avatar fallback.">
                      <div className="grid gap-4 md:grid-cols-2">
                        {testimonials.map((testimonial: TestimonialRecord) => (
                          <Card key={testimonial.id} className="panel-luxury panel-hover">
                            <CardContent className="space-y-4 p-5">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  {testimonial.image ? (
                                    <img src={testimonial.image} alt={testimonial.name} className="h-12 w-12 rounded-full object-cover" />
                                  ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-canvas-texture text-sm font-semibold">{testimonial.initials}</div>
                                  )}
                                  <div>
                                    <p className="font-semibold tracking-tight">{testimonial.name}</p>
                                    <div className="mt-1 flex items-center gap-1">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-4 w-4 ${index < testimonial.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />)}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => setTestimonialDraft({ id: testimonial.id, name: testimonial.name, rating: testimonial.rating, message: testimonial.message, image: testimonial.image })} aria-label="Edit testimonial">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => deleteTestimonial(testimonial.id)} aria-label="Delete testimonial">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm leading-7 text-muted-foreground">“{testimonial.message}”</p>
                              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{formatDate(testimonial.createdAt)}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ModuleShell>
                  </div>
                )}

                {currentSection === "contacts" && (
                  <div className="space-y-6">
                    <ModuleShell title="Enhanced Lead CRM" description="Track source, Hyderabad area tags, and follow-up reminders for leads older than 24 hours without a status update.">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold tracking-tight text-gold/80">Active Leads</h3>
                        <Button variant={isAddingLead ? "outline" : "luxury"} size="sm" onClick={() => setIsAddingLead(!isAddingLead)}>
                          {isAddingLead ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                          {isAddingLead ? "Cancel" : "Add New Lead"}
                        </Button>
                      </div>

                      {isAddingLead && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mb-8 overflow-hidden">
                          <Card className="border-gold/20 bg-secondary/10">
                            <CardContent className="pt-6 space-y-4">
                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Client Name</label>
                                  <Input placeholder="John Doe" value={leadDraft.name} onChange={(e) => setLeadDraft({...leadDraft, name: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Phone Number</label>
                                  <Input placeholder="+91 98765 43210" value={leadDraft.phone} onChange={(e) => setLeadDraft({...leadDraft, phone: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Lead Source</label>
                                  <Input placeholder="Instagram / Reference" value={leadDraft.source} onChange={(e) => setLeadDraft({...leadDraft, source: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Location Tag</label>
                                  <Select value={leadDraft.locationTag} onValueChange={(v) => setLeadDraft({...leadDraft, locationTag: v})}>
                                    <SelectTrigger><SelectValue placeholder="Select Area" /></SelectTrigger>
                                    <SelectContent>{hyderabadAreas.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Initial Status</label>
                                  <Select value={leadDraft.status} onValueChange={(v: LeadStatus) => setLeadDraft({...leadDraft, status: v})}>
                                    <SelectTrigger><SelectValue placeholder="Initial Status" /></SelectTrigger>
                                    <SelectContent>{leadStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Inquiry Details</label>
                                <Textarea placeholder="What is the customer looking for?" className="min-h-[100px]" value={leadDraft.inquiry} onChange={(e) => setLeadDraft({...leadDraft, inquiry: e.target.value})} />
                              </div>
                              <div className="flex justify-end gap-3 pt-2">
                                <Button variant="ghost" size="sm" onClick={() => { setLeadDraft(emptyLeadDraft); setIsAddingLead(false); }}>Discard</Button>
                                <Button variant="luxury" size="sm" disabled={!leadDraft.name || !leadDraft.phone || isSaving} onClick={async () => {
                                  setIsSaving(true);
                                  try {
                                    await addLead(leadDraft);
                                    setLeadDraft(emptyLeadDraft);
                                    setIsAddingLead(false);
                                    setFeedback({ open: true, type: "success", title: "Lead Recorded", message: "The new lead has been successfully added to your CRM." });
                                  } catch (err) {
                                    setFeedback({ open: true, type: "error", title: "Submission Failed", message: "There was an error saving the lead. Please try again." });
                                  } finally {
                                    setIsSaving(false);
                                  }
                                }}>
                                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                  Confirm & Save Lead
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}

                      <div className="overflow-hidden rounded-3xl border border-border/70">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Lead</TableHead>
                              <TableHead>Source</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Reminder</TableHead>
                              <TableHead className="w-16 text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {leads.map((lead) => {
                              const stale = Date.now() - lead.lastStatusChangeAt > 1000 * 60 * 60 * 24;
                              return (
                                <TableRow key={lead.id} className={stale ? "bg-primary/5" : ""}>
                                  <TableCell>
                                    <div className="space-y-1">
                                      <p className="font-medium tracking-tight">{lead.name}</p>
                                      <p className="text-xs text-muted-foreground">{lead.phone}</p>
                                      <p className="max-w-xs text-xs leading-6 text-muted-foreground">{lead.inquiry}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Input value={lead.source || ""} onChange={(event) => updateLead(lead.id, { source: event.target.value })} />
                                  </TableCell>
                                  <TableCell>
                                    <Select value={lead.locationTag || lead.suggestedLocation} onValueChange={(value) => updateLead(lead.id, { locationTag: value })}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select area" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {hyderabadAreas.map((area) => (
                                          <SelectItem key={area} value={area}>{area}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    <Select value={lead.status} onValueChange={(value: LeadStatus) => updateLead(lead.id, { status: value, lastStatusChangeAt: Date.now() })}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {leadStatuses.map((status) => (
                                          <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <BellRing className={`h-4 w-4 ${stale ? "text-primary" : "text-muted-foreground"}`} />
                                      <div>
                                        <p className="text-sm font-medium">{stale ? "Follow up now" : "Healthy"}</p>
                                        <p className="text-xs text-muted-foreground">{formatRelative(Date.now() - lead.lastStatusChangeAt)}</p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-50 hover:opacity-100 transition-opacity" onClick={async () => {
                                      if (confirm("Are you sure you want to delete this lead?")) {
                                        try {
                                          await deleteLead(lead.id);
                                          setFeedback({ open: true, type: "success", title: "Lead Deleted", message: "Record has been removed from CRM." });
                                        } catch (err) {
                                          setFeedback({ open: true, type: "error", title: "Error", message: "Failed to delete lead." });
                                        }
                                      }
                                    }}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </ModuleShell>

                    <ModuleShell title="Contact submissions" description="Messages submitted from the contact page are stored in localStorage and listed here.">
                      <div className="space-y-3">
                        {contacts.length ? (
                          contacts.map((contact: ContactSubmission) => (
                            <Card key={contact.id} className="panel-luxury">
                              <CardContent className="space-y-2 p-4">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="font-semibold tracking-tight">{contact.name}</p>
                                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{new Date(contact.date).toLocaleDateString("en-IN")}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">{contact.phone}</p>
                                <p className="text-sm leading-6 text-muted-foreground">{contact.message}</p>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-border/70 bg-canvas-texture p-5 text-sm text-muted-foreground">No contact submissions yet.</div>
                        )}
                      </div>
                    </ModuleShell>
                  </div>
                )}

                {currentSection === "settings" && settingsDraft && (
                  <ModuleShell title="Site Identity" description="Update global branding, social connections, and legal footers.">
                    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                      <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Site Name</label>
                           <Input value={settingsDraft.siteName || ""} onChange={(event) => setSettingsDraft({ ...settingsDraft, siteName: event.target.value })} placeholder="Site name" />
                        </div>
                        <div className="space-y-3">
                           <div className="flex items-center justify-between">
                              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Site Logo</label>
                              <Button variant="glass" size="sm" onClick={() => settingsLogoUploadRef.current?.click()}>
                                <UploadCloud className="h-4 w-4 mr-2" />
                                Upload
                              </Button>
                              <input ref={settingsLogoUploadRef} type="file" accept="image/*" className="hidden" onChange={async (event) => handleSingleUpload(event, (value) => setSettingsDraft({ ...settingsDraft, logo: value }))} />
                           </div>
                           <Input value={settingsDraft.logo || ""} onChange={(event) => setSettingsDraft({ ...settingsDraft, logo: event.target.value })} placeholder="Logo URL" />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                           <div className="space-y-2">
                              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">WhatsApp Number</label>
                              <Input value={settingsDraft.social.whatsapp || ""} onChange={(event) => setSettingsDraft({ ...settingsDraft, social: { ...settingsDraft.social, whatsapp: event.target.value }, whatsappNumber: event.target.value })} placeholder="WhatsApp" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Instagram URL</label>
                              <Input value={settingsDraft.social.instagram || ""} onChange={(event) => setSettingsDraft({ ...settingsDraft, social: { ...settingsDraft.social, instagram: event.target.value }, instagramUrl: event.target.value })} placeholder="Instagram" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">YouTube Channel</label>
                           <Input value={settingsDraft.social.youtube || ""} onChange={(event) => setSettingsDraft({ ...settingsDraft, social: { ...settingsDraft.social, youtube: event.target.value } })} placeholder="YouTube" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Footer Copy</label>
                           <Textarea value={settingsDraft.footer || ""} onChange={(event) => setSettingsDraft({ ...settingsDraft, footer: event.target.value })} className="min-h-[100px]" placeholder="Footer copy" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Office Address</label>
                           <Textarea value={settingsDraft.officeAddress || ""} onChange={(event) => setSettingsDraft({ ...settingsDraft, officeAddress: event.target.value })} className="min-h-[100px]" placeholder="Office address in Hyderabad" />
                        </div>
                        <Button 
                          variant="luxury" 
                          className="w-full" 
                          disabled={isSaving}
                          onClick={async () => {
                            setIsSaving(true);
                            try {
                              await updateSettings(settingsDraft);
                              setFeedback({
                                open: true,
                                type: "success",
                                title: "Settings Saved",
                                message: "General branding and social settings updated successfully."
                              });
                            } catch (err) {
                              setFeedback({
                                open: true,
                                type: "error",
                                title: "Update Failed",
                                message: "Something went wrong while updating settings."
                              });
                            } finally {
                              setIsSaving(false);
                            }
                          }}
                        >
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Save General Settings
                        </Button>
                      </div>
                      <Card className="panel-luxury bg-canvas-texture">
                        <CardContent className="space-y-5 p-6">
                          <div>
                            <p className="text-sm uppercase tracking-[0.22em] text-primary">Live site preview</p>
                            <h3 className="mt-2 text-2xl font-semibold tracking-tight">Branding & Socials</h3>
                          </div>
                          <div className="space-y-4 rounded-2xl border border-border/70 bg-card/70 p-5">
                            <div className="flex items-center gap-3">
                              <img src={settingsDraft.logo || "/hwa-wall-bg.jpg"} alt={settingsDraft.siteName} className="h-12 w-12 rounded-2xl object-cover" />
                              <div>
                                <p className="font-semibold tracking-tight">{settingsDraft.siteName}</p>
                                <p className="text-sm text-muted-foreground">{settingsDraft.footer}</p>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <p>WhatsApp: {settingsDraft.social.whatsapp}</p>
                              <p>Instagram: {settingsDraft.social.instagram}</p>
                              <p>YouTube: {settingsDraft.social.youtube || "Not set"}</p>
                              <p>Address: {settingsDraft.officeAddress}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ModuleShell>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {previewVideo && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setPreviewVideo(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-gold"
              onClick={e => e.stopPropagation()}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full"
                onClick={() => setPreviewVideo(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              {previewVideo.includes("youtube.com") || previewVideo.includes("youtu.be") ? (
                <iframe 
                  src={previewVideo.includes("v=") ? `https://www.youtube.com/embed/${previewVideo.split("v=")[1]?.split("&")[0]}?autoplay=1` : `https://www.youtube.com/embed/${previewVideo.split("youtu.be/")[1]?.split("?")[0]}?autoplay=1`} 
                  className="w-full h-full border-none"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video src={previewVideo} controls autoPlay className="w-full h-full object-contain bg-black" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <FeedbackModal 
        open={feedback.open} 
        onOpenChange={(open) => setFeedback(prev => ({ ...prev, open }))} 
        title={feedback.title} 
        message={feedback.message} 
        type={feedback.type}
      />
    </div>
  );
}
