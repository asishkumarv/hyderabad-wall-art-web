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
import { useAuth } from "@/lib/auth";
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

const emptyBlogDraft: BlogDraft = { title: "", category: "Design Tips", excerpt: "", content: "", image: "", gallery_images: [] };
const emptyCategoryDraft: CategoryDraft = { name: "", image: "", description: "" };
const emptyVideoDraft: VideoDraft = { title: "", thumbnail: "", videoUrl: "", category: "Home" };
const emptyTestimonialDraft: TestimonialDraft = { name: "", rating: 5, message: "", image: "" };
const leadStatuses: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];
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

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
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
  } = useStore();
  const { theme, toggleTheme } = useThemeMode();

  const currentSection = sections.find((item) => location.pathname.startsWith(item.path))?.key ?? "dashboard";
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [galleryDropActive, setGalleryDropActive] = useState(false);
  const [blogDraft, setBlogDraft] = useState<BlogDraft>(emptyBlogDraft);
  const [categoryDraft, setCategoryDraft] = useState<CategoryDraft>(emptyCategoryDraft);
  const [videoDraft, setVideoDraft] = useState<VideoDraft>(emptyVideoDraft);
  const [testimonialDraft, setTestimonialDraft] = useState<TestimonialDraft>(emptyTestimonialDraft);
  const [profileDraft, setProfileDraft] = useState<ProfileDraft | null>(null);
  const [settingsDraft, setSettingsDraft] = useState<any>(null);
  const [pagesDraft, setPagesDraft] = useState<any>(null);
  const [serviceDrafts, setServiceDrafts] = useState<Record<string, any>>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const galleryUploadRef = useRef<HTMLInputElement>(null);
  const blogUploadRef = useRef<HTMLInputElement>(null);
  const blogGalleryUploadRef = useRef<HTMLInputElement>(null);
  const categoryUploadRef = useRef<HTMLInputElement>(null);
  const videoUploadRef = useRef<HTMLInputElement>(null);
  const testimonialUploadRef = useRef<HTMLInputElement>(null);
  const aboutUploadRef = useRef<HTMLInputElement>(null);
  const homeUploadRef = useRef<HTMLInputElement>(null);
  const settingsLogoUploadRef = useRef<HTMLInputElement>(null);
  const serviceUploadRefs = useRef<Record<string, HTMLInputElement | null>>({});

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const galleryCategories = ["All", ...new Set(gallery.map((image) => image.category))];
  const filteredGallery = galleryFilter === "All" ? gallery : gallery.filter((image) => image.category === galleryFilter);
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

  const handleGalleryUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const imageUrl = await fileToDataUrl(file);
    addGalleryImage({
      title: file.name.replace(/\.[^.]+$/, ""),
      category: galleryFilter === "All" ? "Living Room" : galleryFilter,
      altText: `Wall art installation in ${hyderabadAreas[0]}`,
      imageUrl,
    });
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setGalleryDropActive(false);
    await handleGalleryUpload(event.dataTransfer.files);
  };

  const handleSingleUpload = async (event: ChangeEvent<HTMLInputElement>, onDone: (value: string) => void) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onDone(await fileToDataUrl(file));
    (event.target as HTMLInputElement).value = "";
  };

  const handleMultipleUpload = async (event: ChangeEvent<HTMLInputElement>, onDone: (values: string[]) => void) => {
    const files = event.target.files;
    if (!files) return;
    const urls = await Promise.all(Array.from(files).map(f => fileToDataUrl(f)));
    onDone(urls);
    (event.target as HTMLInputElement).value = "";
  };

  useEffect(() => {
    if (user && !profileDraft) {
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
  }, [user, profileDraft]);

  useEffect(() => {
    if (settings && !settingsDraft) {
      setSettingsDraft({ ...settings });
    }
  }, [settings, settingsDraft]);

  useEffect(() => {
    if (pages && !pagesDraft) {
      setPagesDraft({ ...pages });
    }
  }, [pages, pagesDraft]);

  useEffect(() => {
    if (services.length > 0 && Object.keys(serviceDrafts).length === 0) {
      const drafts: Record<string, any> = {};
      services.forEach(s => {
        drafts[s.key] = { ...s };
      });
      setServiceDrafts(drafts);
    }
  }, [services, serviceDrafts]);

  const saveBlogDraft = async () => {
    if (!blogDraft.title.trim() || !blogDraft.content.trim()) return;
    const payload = {
      ...blogDraft,
      slug: slugify(blogDraft.title),
      image: blogDraft.image || "/hwa-wall-bg.jpg",
    };
    try {
      if (blogDraft.id) await updateBlogPost(blogDraft.id, payload);
      else await addBlogPost(payload);
      toast.success(blogDraft.id ? "Blog post updated!" : "Blog post published!");
      setBlogDraft(emptyBlogDraft);
    } catch (err) {
      toast.error("Failed to save blog post");
    }
  };

  const saveCategoryDraft = async () => {
    if (!categoryDraft.name.trim()) return;
    try {
      if (categoryDraft.id) await updateCategory(categoryDraft.id, categoryDraft);
      else await addCategory({ ...categoryDraft, image: categoryDraft.image || "/hwa-wall-bg.jpg" });
      toast.success(categoryDraft.id ? "Category updated!" : "Category added!");
      setCategoryDraft(emptyCategoryDraft);
    } catch (err) {
      toast.error("Failed to save category");
    }
  };

  const saveVideoDraft = async () => {
    if (!videoDraft.title.trim() || !videoDraft.videoUrl.trim()) return;
    try {
      if (videoDraft.id) await updateVideo(videoDraft.id, { ...videoDraft, thumbnail: videoDraft.thumbnail || "/hwa-wall-bg.jpg" });
      else await addVideo({ ...videoDraft, thumbnail: videoDraft.thumbnail || "/hwa-wall-bg.jpg" });
      toast.success(videoDraft.id ? "Video updated!" : "Video added!");
      setVideoDraft(emptyVideoDraft);
    } catch (err) {
      toast.error("Failed to save video");
    }
  };

  const saveTestimonialDraft = async () => {
    if (!testimonialDraft.name.trim() || !testimonialDraft.message.trim()) return;
    const payload = {
      ...testimonialDraft,
      image: testimonialDraft.image || "",
    };
    try {
      if (testimonialDraft.id) await updateTestimonial(testimonialDraft.id, payload);
      else await addTestimonial(payload);
      toast.success(testimonialDraft.id ? "Testimonial updated!" : "Testimonial added!");
      setTestimonialDraft(emptyTestimonialDraft);
    } catch (err) {
      toast.error("Failed to save testimonial");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
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
                  <p className="text-lg font-semibold tracking-tight">{settings.whatsappNumber}</p>
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
                          <p className="text-lg font-semibold tracking-tight">{settings.whatsappNumber}</p>
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
                                onClick={async () => {
                                  try {
                                    await updateService(service.key, draft);
                                    toast.success(`${service.label} service updated successfully!`);
                                  } catch (err) {
                                    toast.error(`Failed to update ${service.label} service`);
                                    console.error(err);
                                  }
                                }}
                              >
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
                          <Button variant="luxury" onClick={saveBlogDraft}>{blogDraft.id ? "Update post" : "Publish post"}</Button>
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
                          <Button variant="luxury" onClick={saveCategoryDraft}>{categoryDraft.id ? "Update category" : "Add category"}</Button>
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
                        <Input value={videoDraft.videoUrl || ""} onChange={(event) => setVideoDraft((draft) => ({ ...draft, videoUrl: event.target.value }))} placeholder="YouTube or file URL" />
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
                          <Button variant="luxury" onClick={saveVideoDraft}>{videoDraft.id ? "Update video" : "Add video"}</Button>
                        </div>
                      </div>
                    </ModuleShell>

                    <ModuleShell title="Saved videos" description="Click targets open the configured video URL on the public site.">
                      <div className="space-y-3">
                        {videos.map((video) => (
                          <Card key={video.id} className="panel-luxury overflow-hidden">
                            <div className="grid gap-4 p-4 lg:grid-cols-[160px_1fr]">
                              <div className="relative overflow-hidden rounded-2xl border border-border/70">
                                <img src={video.thumbnail} alt={video.title} className="aspect-video h-full w-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/80">
                                    <Play className="h-4 w-4 text-primary" />
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="font-semibold tracking-tight">{video.title}</p>
                                    <p className="text-sm text-muted-foreground">{video.videoUrl}</p>
                                  </div>
                                  <Badge variant="outline">{video.category}</Badge>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => setVideoDraft(video)} aria-label="Edit video">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => deleteVideo(video.id)} aria-label="Delete video">
                                    <Trash2 className="h-4 w-4" />
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
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Hero Title</label>
                          <Input value={pagesDraft.home.heroTitle || ""} onChange={(event) => setPagesDraft({ ...pagesDraft, home: { ...pagesDraft.home, heroTitle: event.target.value } })} placeholder="Hero title" />
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                             <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Hero Images</label>
                             <Button variant="glass" size="sm" onClick={() => homeUploadRef.current?.click()}>
                               <UploadCloud className="h-4 w-4 mr-2" />
                               Upload
                             </Button>
                             <input ref={homeUploadRef} type="file" accept="image/*" className="hidden" onChange={async (event) => handleSingleUpload(event, (value) => setPagesDraft({ ...pagesDraft, home: { ...pagesDraft.home, heroImages: [...(pagesDraft.home.heroImages || []), value] } }))} />
                          </div>
                          <Textarea value={(pagesDraft.home.heroImages || []).join("\n")} onChange={(event) => setPagesDraft({ ...pagesDraft, home: { ...pagesDraft.home, heroImages: event.target.value.split("\n").map((entry) => entry.trim()).filter(Boolean) } })} className="min-h-[160px]" placeholder="One image URL or base64 string per line" />
                        </div>
                        <Button 
                          variant="luxury" 
                          className="w-full" 
                          onClick={async () => {
                            try {
                              await updateHomePage(pagesDraft.home);
                              toast.success("Home page updated!");
                            } catch (err) {
                              toast.error("Failed to update home page");
                            }
                          }}
                        >
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
                          <Textarea value={pagesDraft.about.founderDescription || ""} onChange={(event) => setPagesDraft({ ...pagesDraft, about: { ...pagesDraft.about, founderDescription: event.target.value } })} className="min-h-[120px]" placeholder="Founder description" />
                        </div>
                        <Button 
                          variant="luxury" 
                          className="w-full" 
                          onClick={async () => {
                            try {
                              await updateAboutPage(pagesDraft.about);
                              toast.success("About page updated!");
                            } catch (err) {
                              toast.error("Failed to update about page");
                            }
                          }}
                        >
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
                          <Textarea value={pagesDraft.contact.mapEmbed || ""} onChange={(event) => setPagesDraft({ ...pagesDraft, contact: { ...pagesDraft.contact, mapEmbed: event.target.value } })} className="min-h-[120px]" placeholder="Map embed URL" />
                        </div>
                        <Button 
                          variant="luxury" 
                          className="w-full" 
                          onClick={async () => {
                            try {
                              await updateContactPage(pagesDraft.contact);
                              toast.success("Contact page updated!");
                            } catch (err) {
                              toast.error("Failed to update contact page");
                            }
                          }}
                        >
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
                          <Button variant="luxury" onClick={saveTestimonialDraft}>{testimonialDraft.id ? "Update testimonial" : "Add testimonial"}</Button>
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
                      <div className="overflow-hidden rounded-3xl border border-border/70">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Lead</TableHead>
                              <TableHead>Source</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Reminder</TableHead>
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
                          onClick={async () => {
                            try {
                              await updateSettings(settingsDraft);
                              toast.success("General settings updated!");
                            } catch (err) {
                              toast.error("Failed to update settings");
                            }
                          }}
                        >
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
    </div>
  );
}
