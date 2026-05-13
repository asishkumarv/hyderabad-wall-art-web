import { createFileRoute } from "@tanstack/react-router";
import ServicePageLayout from "@/components/ServicePageLayout";
import muralImg from "@/assets/service-mural.jpg";

export const Route = createFileRoute("/wall-art-services/mural-paintings")({
  head: () => ({
    meta: [
      { title: "Mural Paintings — Hyderabad Wall Arts" },
      { name: "description", content: "Large-scale artistic murals for indoor and outdoor walls." },
    ],
  }),
  component: () => (
    <ServicePageLayout
      title="Mural Paintings"
      subtitle="Wall Art Services"
      description="Large-scale artistic murals that tell stories and transform entire walls into magnificent works of art. From cultural themes to contemporary designs, our mural artists bring vision to life on indoor and outdoor walls."
      image={muralImg}
      benefits={["Large-scale artistic murals", "Indoor & outdoor walls", "Cultural & contemporary themes"]}
      whyChoose={["Large-scale mural expertise", "Cultural and contemporary themes", "Public and private mural experience", "Weather-resistant outdoor murals", "Team of mural art specialists", "Award-winning mural projects"]}
      relatedServices={[{ label: "3D Painting", to: "/wall-art-services/home/3d-painting" }, { label: "Stencil Painting", to: "/wall-art-services/stencil-wall-painting" }, { label: "Wood Carved Art", to: "/wall-art-services/wood-carved-wall-art" }]}
    />
  ),
});
