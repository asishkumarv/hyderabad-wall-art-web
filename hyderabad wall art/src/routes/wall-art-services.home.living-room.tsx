import { createFileRoute } from "@tanstack/react-router";
import ServicePageLayout from "@/components/ServicePageLayout";
import livingRoomImg from "@/assets/service-living-room.jpg";

export const Route = createFileRoute("/wall-art-services/home/living-room")({
  head: () => ({
    meta: [
      { title: "Living Room Wall Art — Hyderabad Wall Arts" },
      { name: "description", content: "Elegant, modern wall art designs for living rooms." },
    ],
  }),
  component: () => (
    <ServicePageLayout
      serviceKey="home"
      title="Living Room Wall Art"
      subtitle="Home Wall Art"
      description="Make your living room the heart of your home with captivating wall art. From elegant abstract designs to luxury modern styles, we create focal points that spark conversations and reflect your personality."
      image={livingRoomImg}
      benefits={["Elegant abstract designs", "Luxury modern styles", "Custom color palettes"]}
      whyChoose={["Custom designs tailored to your interior style", "Wide range of art styles: modern, traditional, abstract", "Color consultation to match existing decor", "Premium quality paints with 10+ year durability", "Clean and organized work process", "Satisfaction guaranteed with free touch-ups"]}
      relatedServices={[{ label: "TV Unit Wall", to: "/wall-art-services/home/tv-unit" }, { label: "Master Bedroom", to: "/wall-art-services/home/master-bedroom" }, { label: "3D Painting", to: "/wall-art-services/home/3d-painting" }]}
    />
  ),
});
