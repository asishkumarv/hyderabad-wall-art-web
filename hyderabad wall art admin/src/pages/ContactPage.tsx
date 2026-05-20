import { useState } from "react";
import { ArrowLeft, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";

function cleanWhatsappNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

function getMapEmbedUrl(value: string) {
  if (!value) return "";

  // 1. If it's a full iframe HTML tag, extract the src
  if (value.includes("<iframe")) {
    const srcMatch = value.match(/src="([^"]+)"/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }

  // 2. If it's already an embed URL, return it
  if (value.includes("output=embed") || value.includes("/maps/embed") || value.includes("pb=")) {
    return value;
  }

  // 3. If it's a standard share / place URL, extract coordinates or place name
  const coordMatch = value.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordMatch && coordMatch[1] && coordMatch[2]) {
    return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=17&output=embed`;
  }

  const placeMatch = value.match(/\/maps\/place\/([^/]+)/);
  if (placeMatch && placeMatch[1]) {
    return `https://maps.google.com/maps?q=${placeMatch[1]}&z=17&output=embed`;
  }

  // 4. Default fallback: wrap search query
  return `https://maps.google.com/maps?q=${encodeURIComponent(value)}&z=17&output=embed`;
}

export default function ContactPage() {
  const { pages, settings, addContactSubmission } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo size={48} src={settings.logo || undefined} alt={settings.siteName} />
            <div>
              <p className="text-lg font-semibold tracking-tight">{settings.siteName}</p>
              <p className="text-sm text-muted-foreground">Contact</p>
            </div>
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link to="/"><ArrowLeft className="h-4 w-4" /> Back</Link>
          </Button>
        </div>
      </header>

      <main className="container py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="panel-luxury"><CardContent className="space-y-5 p-8"><h1 className="text-4xl font-semibold tracking-tight">Let’s plan your wall art project</h1><div className="space-y-4 text-sm text-muted-foreground"><div className="flex items-start gap-3"><Phone className="mt-1 h-4 w-4 text-primary" /><span>{pages.contact.phone}</span></div><div className="flex items-start gap-3"><Mail className="mt-1 h-4 w-4 text-primary" /><span>{pages.contact.email}</span></div><div className="flex items-start gap-3"><MapPin className="mt-1 h-4 w-4 text-primary" /><span>{pages.contact.address}</span></div></div><div className="flex flex-wrap gap-3"><Button asChild variant="luxury"><a href={`https://wa.me/${cleanWhatsappNumber(pages.contact.whatsapp)}`} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> WhatsApp</a></Button><Button asChild variant="outline"><a href={`mailto:${pages.contact.email}`}>Email us</a></Button></div><div className="overflow-hidden rounded-2xl border border-border/70">{pages.contact.mapEmbed ? <iframe title="Hyderabad Wall Arts map" src={getMapEmbedUrl(pages.contact.mapEmbed)} className="h-72 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : <div className="flex h-72 items-center justify-center bg-card text-sm text-muted-foreground">Map coming soon</div>}</div></CardContent></Card>
          <Card className="panel-luxury"><CardContent className="space-y-4 p-8"><h2 className="text-2xl font-semibold tracking-tight">Send an enquiry</h2><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /><Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" /><Textarea value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-[180px]" placeholder="Tell us about your wall, style, and location" /><Button variant="luxury" onClick={() => { if (!name.trim() || !phone.trim() || !message.trim()) return; addContactSubmission({ name, phone, message }); setName(""); setPhone(""); setMessage(""); }}>Submit</Button></CardContent></Card>
        </div>
      </main>
    </div>
  );
}
