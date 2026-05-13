import { createFileRoute } from "@tanstack/react-router";
import ServicePageLayout from "@/components/ServicePageLayout";
import bedroomImg from "@/assets/service-bedroom.jpg";

export const Route = createFileRoute("/wall-art-services/home/master-bedroom")({
  head: () => ({ meta: [{ title: "Master Bedroom Wall Art — Hyderabad Wall Arts" }] }),
  component: () => (
    <ServicePageLayout
      title="Master Bedroom Wall Art"
      subtitle="Home Wall Art"
      description="Create a serene and elegant atmosphere in your master bedroom with calm, aesthetic themes and soft tones. Our custom wall art helps you relax and unwind in premium artistic style."
      image={bedroomImg}
      benefits={["Calm aesthetic themes", "Soft tones", "Premium art finishes"]}
      whyChoose={["Calming and elegant design options", "Low-odor paints for bedrooms", "Designs that promote relaxation", "Headboard accent wall specialists", "Subtle textures and finishes", "Weekend installation available"]}
      relatedServices={[{ label: "Living Room", to: "/wall-art-services/home/living-room" }, { label: "Guest Room", to: "/wall-art-services/home/guest-room" }, { label: "Kids Room", to: "/wall-art-services/home/kids-room" }]}
    />
  ),
});
