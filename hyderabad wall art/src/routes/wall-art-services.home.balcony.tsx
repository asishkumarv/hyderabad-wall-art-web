import { createFileRoute } from "@tanstack/react-router";
import ServicePageLayout from "@/components/ServicePageLayout";
import balconyImg from "@/assets/service-balcony.jpg";

export const Route = createFileRoute("/wall-art-services/home/balcony")({
  head: () => ({ meta: [{ title: "Balcony Wall Art — Hyderabad Wall Arts" }] }),
  component: () => (
    <ServicePageLayout
      title="Balcony Wall Art"
      subtitle="Home Wall Art"
      description="Enhance your balcony with nature-inspired designs and murals that create a serene outdoor retreat. From tropical garden designs to weather-resistant nature-themed art."
      image={balconyImg}
      benefits={["Nature-themed murals", "Tropical garden designs", "Weather-resistant art"]}
      whyChoose={["Weather-resistant outdoor paint", "Nature and landscape expertise", "UV-protected finishes", "Custom designs for any balcony size", "Quick and clean installation", "Maintenance guidance included"]}
      relatedServices={[{ label: "Guest Room", to: "/wall-art-services/home/guest-room" }, { label: "Staircase Wall", to: "/wall-art-services/home/staircase" }]}
    />
  ),
});
