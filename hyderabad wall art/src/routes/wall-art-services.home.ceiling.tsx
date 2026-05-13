import { createFileRoute } from "@tanstack/react-router";
import ServicePageLayout from "@/components/ServicePageLayout";
import ceilingImg from "@/assets/service-ceiling.jpg";

export const Route = createFileRoute("/wall-art-services/home/ceiling")({
  head: () => ({ meta: [{ title: "Ceiling Art — Hyderabad Wall Arts" }] }),
  component: () => (
    <ServicePageLayout
      title="Ceiling Art"
      subtitle="Home Wall Art"
      description="Transform your ceilings with stunning sky murals, abstract patterns, and artistic designs. Our ceiling art creates an unforgettable ambiance with sky and abstract ceiling art."
      image={ceilingImg}
      benefits={["Sky and cloud murals", "Abstract ceiling patterns", "False ceiling art"]}
      whyChoose={["Specialized ceiling painting expertise", "Safe and efficient work process", "Sky, abstract and artistic themes", "Durable overhead paint materials", "Minimal disruption to your home", "Free design visualization"]}
      relatedServices={[{ label: "Living Room", to: "/wall-art-services/home/living-room" }, { label: "Master Bedroom", to: "/wall-art-services/home/master-bedroom" }]}
    />
  ),
});
