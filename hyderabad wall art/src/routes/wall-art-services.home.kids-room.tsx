import { createFileRoute } from "@tanstack/react-router";
import ServicePageLayout from "@/components/ServicePageLayout";
import kidsRoomImg from "@/assets/service-kids-room.jpg";

export const Route = createFileRoute("/wall-art-services/home/kids-room")({
  head: () => ({ meta: [{ title: "Kids Room Wall Art — Hyderabad Wall Arts" }] }),
  component: () => (
    <ServicePageLayout
      title="Kids Room Wall Art"
      subtitle="Home Wall Art"
      description="Transform your child's room into a magical wonderland! Our kids room wall art features vibrant cartoons, fairy tales, space themes, underwater worlds, and more — sparking imagination and creativity."
      image={kidsRoomImg}
      benefits={["Cartoon & creative themes", "Educational murals", "Fantasy designs"]}
      whyChoose={["100% child-safe, non-toxic paints", "Age-appropriate themes and characters", "Bright, stimulating colors", "Educational elements incorporated", "Easy-to-clean finishes", "Custom character and theme requests welcome"]}
      relatedServices={[{ label: "School Cartoon", to: "/wall-art-services/commercial/school-cartoon" }, { label: "Master Bedroom", to: "/wall-art-services/home/master-bedroom" }]}
    />
  ),
});
