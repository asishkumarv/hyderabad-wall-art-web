import { createFileRoute } from "@tanstack/react-router";
import ServicePageLayout from "@/components/ServicePageLayout";
import guestImg from "@/assets/service-guestroom.jpg";

export const Route = createFileRoute("/wall-art-services/home/guest-room")({
  head: () => ({ meta: [{ title: "Guest Room Wall Art — Hyderabad Wall Arts" }] }),
  component: () => (
    <ServicePageLayout
      title="Guest Room Wall Art"
      subtitle="Home Wall Art"
      description="Create a welcoming atmosphere for your guests with minimal, elegant styling and sophisticated wall art that exudes elegance and comfort."
      image={guestImg}
      benefits={["Minimal elegant designs", "Calming color palettes", "Sophisticated artwork"]}
      whyChoose={["Elegant minimal design approach", "Calming color palette expertise", "Quick turnaround time", "Perfect for creating welcoming spaces", "Premium materials for lasting beauty", "Free design consultation"]}
      relatedServices={[{ label: "Master Bedroom", to: "/wall-art-services/home/master-bedroom" }, { label: "Living Room", to: "/wall-art-services/home/living-room" }]}
    />
  ),
});
