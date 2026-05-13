import { createFileRoute } from "@tanstack/react-router";
import ServicePageLayout from "@/components/ServicePageLayout";
import woodImg from "@/assets/service-woodcarved.jpg";

export const Route = createFileRoute("/wall-art-services/wood-carved-wall-art")({
  head: () => ({
    meta: [
      { title: "Wood Carved Wall Art — Hyderabad Wall Arts" },
      { name: "description", content: "Premium handcrafted wooden wall panels and carvings for luxury interiors." },
    ],
  }),
  component: () => (
    <ServicePageLayout
      title="Wood Carved Wall Art"
      subtitle="Wall Art Services"
      description="Premium handcrafted wooden wall panels and carvings that add luxury and texture to any interior. Our skilled artisans create bespoke wood-carved installations for luxury interiors."
      image={woodImg}
      benefits={["Premium handcrafted panels", "Luxury interiors", "Bespoke wood carvings"]}
      whyChoose={["Master woodcarving artisans", "Premium wood materials sourced responsibly", "Custom design consultation", "Traditional and contemporary styles", "Durable lacquer finishes", "Installation and maintenance support"]}
      relatedServices={[{ label: "Mural Paintings", to: "/wall-art-services/mural-paintings" }, { label: "Stencil Painting", to: "/wall-art-services/stencil-wall-painting" }]}
    />
  ),
});
