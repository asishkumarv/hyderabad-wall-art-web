import { createFileRoute } from "@tanstack/react-router";
import ServicePageLayout from "@/components/ServicePageLayout";
import stencilImg from "@/assets/service-stencil.jpg";

export const Route = createFileRoute("/wall-art-services/stencil-wall-painting")({
  head: () => ({
    meta: [
      { title: "Stencil Wall Painting — Hyderabad Wall Arts" },
      { name: "description", content: "Beautiful repetitive pattern designs using professional stencil techniques." },
    ],
  }),
  component: () => (
    <ServicePageLayout
      serviceKey="stencil"
      title="Stencil Wall Painting"
      subtitle="Wall Art Services"
      description="Beautiful repetitive pattern designs using professional stencil techniques. Budget-friendly yet stylish, our stencil paintings add texture and character to any wall with precision and elegance."
      image={stencilImg}
      benefits={["Repetitive patterns", "Budget-friendly designs", "Professional stencil techniques"]}
      whyChoose={["Extensive stencil pattern library", "Precision application techniques", "Budget-friendly pricing", "Suitable for all room types", "Quick turnaround time", "Custom pattern creation available"]}
      relatedServices={[{ label: "Mural Paintings", to: "/wall-art-services/mural-paintings" }, { label: "Wood Carved Art", to: "/wall-art-services/wood-carved-wall-art" }]}
    />
  ),
});
