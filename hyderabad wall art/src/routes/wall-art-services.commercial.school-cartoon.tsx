import { createFileRoute } from "@tanstack/react-router";
import ServicePageLayout from "@/components/ServicePageLayout";
import schoolImg from "@/assets/service-school.jpg";

export const Route = createFileRoute("/wall-art-services/commercial/school-cartoon")({
  head: () => ({
    meta: [
      { title: "School Cartoon Painting — Hyderabad Wall Arts" },
      { name: "description", content: "Bright, fun, and educational cartoon wall paintings designed for schools." },
    ],
  }),
  component: () => (
    <ServicePageLayout
      title="School Cartoon Painting"
      subtitle="Commercial Wall Art"
      description="Bright, fun, and educational wall art designed for schools and kids spaces. Our cartoon characters, educational themes, and playful designs create engaging learning environments that stimulate young minds."
      image={schoolImg}
      benefits={["Cartoon characters", "Educational themes", "Playful designs"]}
      whyChoose={["Child-safe, non-toxic paints exclusively", "Educational themes that support learning", "Vibrant, long-lasting colors", "Age-appropriate designs for different sections", "Quick installation during school breaks", "Trusted by 50+ schools across Hyderabad"]}
      relatedServices={[{ label: "Kids Room", to: "/wall-art-services/home/kids-room" }, { label: "Hotels & Restaurants", to: "/wall-art-services/commercial/hotels-restaurants" }]}
    />
  ),
});
