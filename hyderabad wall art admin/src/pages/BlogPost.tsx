import { ArrowLeft, CalendarDays, MessageCircle } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDisplayDate, renderRichText } from "@/lib/rich-text";
import { useStore } from "@/lib/store";

function cleanWhatsappNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

export default function BlogPost() {
  const { slug } = useParams();
  const { blogPosts, settings } = useStore();
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo size={48} src={settings.logo || undefined} alt={settings.siteName} />
            <div>
              <p className="text-lg font-semibold tracking-tight">{settings.siteName}</p>
              <p className="text-sm text-muted-foreground">Blog article</p>
            </div>
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link to="/"><ArrowLeft className="h-4 w-4" /> Back</Link>
          </Button>
        </div>
      </header>

      <main className="container py-10">
        <Card className="panel-luxury overflow-hidden">
          <div className="aspect-[16/8] overflow-hidden border-b border-border/70">
            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          </div>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3"><Badge variant="secondary">{post.category}</Badge><div className="flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="h-4 w-4" />{formatDisplayDate(post.createdAt)}</div></div>
              <h1 className="text-4xl font-semibold tracking-tight">{post.title}</h1>
            </div>
            <div className="space-y-4">{renderRichText(post.content)}</div>
            <Button asChild variant="glass"><a href={`https://wa.me/${cleanWhatsappNumber(settings.whatsappNumber)}`} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> Discuss this style</a></Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
