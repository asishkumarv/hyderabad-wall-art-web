import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold font-heading text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Hyderabad Wall Arts — Premium Wall Art Services" },
      { name: "description", content: "Transform your spaces with Hyderabad Wall Arts. Expert mural paintings, 3D art, commercial and home wall art services since 2000." },
      { name: "author", content: "Hyderabad Wall Arts" },
      { property: "og:title", content: "Hyderabad Wall Arts — Premium Wall Art Services" },
      { property: "og:description", content: "Transform your spaces with Hyderabad Wall Arts. Expert mural paintings, 3D art, commercial and home wall art services since 2000." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Hyderabad Wall Arts — Premium Wall Art Services" },
      { name: "twitter:description", content: "Transform your spaces with Hyderabad Wall Arts. Expert mural paintings, 3D art, commercial and home wall art services since 2000." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/31161d7a-3f3b-4c65-88b8-67681aa1196d/id-preview-9e845b78--23358e5c-32c8-40b2-af51-6332f6b2a9c3.lovable.app-1776789232894.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/31161d7a-3f3b-4c65-88b8-67681aa1196d/id-preview-9e845b78--23358e5c-32c8-40b2-af51-6332f6b2a9c3.lovable.app-1776789232894.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
