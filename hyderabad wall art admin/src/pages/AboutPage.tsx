import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDisplayDate, renderRichText } from "@/lib/rich-text";
import { useStore } from "@/lib/store";

export default function AboutPage() {
  const { pages, settings } = useStore();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo size={48} src={settings.logo || undefined} alt={settings.siteName} />
            <div>
              <p className="text-lg font-semibold tracking-tight">{settings.siteName}</p>
              <p className="text-sm text-muted-foreground">About</p>
            </div>
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link to="/"><ArrowLeft className="h-4 w-4" /> Back</Link>
          </Button>
        </div>
      </header>

      <main className="container py-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="panel-luxury"><CardContent className="space-y-5 p-8"><Badge variant="secondary">Studio story</Badge><h1 className="text-4xl font-semibold tracking-tight">{pages.about.title}</h1><div className="space-y-4">{renderRichText(pages.about.content)}</div></CardContent></Card>
          <Card className="panel-luxury overflow-hidden"><div className="aspect-[4/5] overflow-hidden border-b border-border/70"><img src={pages.about.founderImage} alt={pages.about.founderName} className="h-full w-full object-cover" /></div><CardContent className="space-y-3 p-8"><p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Founder</p><h2 className="text-3xl font-semibold tracking-tight">{pages.about.founderName}</h2><p className="text-sm leading-7 text-muted-foreground">{pages.about.founderDescription}</p><p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Updated {formatDisplayDate(Date.now())}</p></CardContent></Card>
        </div>
      </main>
    </div>
  );
}
