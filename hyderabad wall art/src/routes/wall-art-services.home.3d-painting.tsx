import { createFileRoute } from "@tanstack/react-router";
import ServicePageLayout from "@/components/ServicePageLayout";
import threeDImg from "@/assets/service-3d-painting.jpg";

export const Route = createFileRoute("/wall-art-services/home/3d-painting")({
  head: () => ({ meta: [{ title: "3D Wall Painting — Hyderabad Wall Arts" }] }),
  component: () => (
    <ServicePageLayout
      title="3D Wall Painting"
      subtitle="Home Wall Art"
      description="Experience the magic of three-dimensional wall art. Our 3D paintings create stunning depth illusion walls with optical illusions that add dimension and a wow factor to any room."
      image={threeDImg}
      benefits={["Depth illusion art", "Optical effects", "Hyper-realistic 3D"]}
      whyChoose={["Masters of optical illusion techniques", "Hyper-realistic 3D effects", "Perfect for Instagram-worthy interiors", "Wide range of 3D themes available", "Precision work with attention to detail", "Unique and conversation-starting designs"]}
      relatedServices={[{ label: "Living Room", to: "/wall-art-services/home/living-room" }, { label: "Mural Paintings", to: "/wall-art-services/mural-paintings" }]}
    />
  ),
});
