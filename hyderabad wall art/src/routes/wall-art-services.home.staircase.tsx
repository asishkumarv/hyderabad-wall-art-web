import { createFileRoute } from "@tanstack/react-router";
import ServicePageLayout from "@/components/ServicePageLayout";
import staircaseImg from "@/assets/service-staircase.jpg";

export const Route = createFileRoute("/wall-art-services/home/staircase")({
  head: () => ({ meta: [{ title: "Staircase Wall Art — Hyderabad Wall Arts" }] }),
  component: () => (
    <ServicePageLayout
      title="Staircase Wall Art"
      subtitle="Home Wall Art"
      description="Turn your staircase into a stunning art gallery with vertical storytelling designs. Our staircase wall art creates a visual journey as you move between floors, with continuous murals, nature scenes, and abstract designs."
      image={staircaseImg}
      whyChoose={["Expertise in tall and angled wall surfaces", "Continuous mural designs across floors", "Safety-first approach during installation", "Dramatic visual impact", "Custom designs for spiral and straight staircases", "Durable finishes for high-traffic areas"]}
      relatedServices={[{ label: "Living Room", to: "/wall-art-services/home/living-room" }, { label: "Ceiling", to: "/wall-art-services/home/ceiling" }]}
    />
  ),
});
