import { createFileRoute } from "@tanstack/react-router";
import ServicePageLayout from "@/components/ServicePageLayout";
import officeImg from "@/assets/service-office.jpg";

export const Route = createFileRoute("/wall-art-services/commercial/shops-offices")({
  head: () => ({
    meta: [
      { title: "Shops & Offices Wall Art — Hyderabad Wall Arts" },
      { name: "description", content: "Transform workspaces and retail stores with creative branding walls and modern art." },
    ],
  }),
  component: () => (
    <ServicePageLayout
      title="Shops & Offices"
      subtitle="Commercial Wall Art"
      description="Transform workspaces and retail stores with creative branding walls and modern art. From logo walls to motivational designs and creative office murals, we elevate your professional environment."
      image={officeImg}
      benefits={["Logo walls", "Motivational designs", "Creative office murals"]}
      whyChoose={["Corporate and retail design expertise", "Brand-aligned artwork and color schemes", "Quick turnaround with weekend installation", "Eco-friendly, low-VOC paint materials", "Scalable solutions for multi-location businesses", "Post-installation maintenance guidance"]}
      relatedServices={[{ label: "Hotels & Restaurants", to: "/wall-art-services/commercial/hotels-restaurants" }, { label: "School Cartoon", to: "/wall-art-services/commercial/school-cartoon" }]}
    />
  ),
});
