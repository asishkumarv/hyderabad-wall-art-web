import { createFileRoute } from "@tanstack/react-router";
import ServicePageLayout from "@/components/ServicePageLayout";
import hotelImg from "@/assets/service-hotel.jpg";

export const Route = createFileRoute("/wall-art-services/commercial/hotels-restaurants")({
  head: () => ({
    meta: [
      { title: "Hotels & Restaurants Wall Art — Hyderabad Wall Arts" },
      { name: "description", content: "Create immersive dining experiences with themed murals, textured finishes, and artistic concepts." },
    ],
  }),
  component: () => (
    <ServicePageLayout
      serviceKey="commercial"
      title="Hotels & Restaurants Wall Art"
      subtitle="Commercial Wall Art"
      description="Create immersive dining experiences with themed wall art, murals, textured finishes, and artistic concepts tailored to your brand. Our designs enhance ambience, attract customers, and create Instagram-worthy interiors."
      image={hotelImg}
      benefits={["Theme-based murals", "Luxury texture finishes", "Cultural & modern art styles"]}
      whyChoose={["20+ years of hospitality interior experience", "Custom themed mural designs", "Instagram-worthy dining interiors", "Premium texture and finish options", "Minimal disruption to business operations", "Free design consultation"]}
      relatedServices={[{ label: "Shops & Offices", to: "/wall-art-services/commercial/shops-offices" }, { label: "School Cartoon", to: "/wall-art-services/commercial/school-cartoon" }]}
    />
  ),
});
