import { createFileRoute } from "@tanstack/react-router";
import ServicePageLayout from "@/components/ServicePageLayout";
import { type ServiceKey } from "@/lib/store";

export const Route = createFileRoute("/wall-art-services/$serviceKey")({
  component: DynamicServicePage,
});

function DynamicServicePage() {
  const { serviceKey } = Route.useParams();

  return (
    <ServicePageLayout
      serviceKey={serviceKey as ServiceKey}
      title="Service Detail"
      subtitle="Wall Art Services"
      description="Loading service details..."
      image="/hwa-wall-bg.jpg"
      whyChoose={[]}
    />
  );
}
