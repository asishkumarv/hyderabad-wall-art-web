import { createFileRoute } from "@tanstack/react-router";
import ServicePageLayout from "@/components/ServicePageLayout";
import tvImg from "@/assets/service-tvunit.jpg";

export const Route = createFileRoute("/wall-art-services/home/tv-unit")({
  head: () => ({ meta: [{ title: "TV Unit Wall Art — Hyderabad Wall Arts" }] }),
  component: () => (
    <ServicePageLayout
      title="TV Unit Wall Art"
      subtitle="Home Wall Art"
      description="Elevate your entertainment area with stunning TV unit wall designs. Textured panels and highlight focal walls that make your TV unit the centerpiece of your living space."
      image={tvImg}
      benefits={["Textured panel designs", "3D wall cladding", "Custom backlight integration"]}
      whyChoose={["Custom TV unit wall expertise", "Textured and panel design options", "Integration with existing decor", "Premium materials and finishes", "Clean and organized work process", "After-installation support"]}
      relatedServices={[{ label: "Living Room", to: "/wall-art-services/home/living-room" }, { label: "Master Bedroom", to: "/wall-art-services/home/master-bedroom" }]}
    />
  ),
});
