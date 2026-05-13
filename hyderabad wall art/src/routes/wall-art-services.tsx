import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/wall-art-services")({
  component: () => <Outlet />,
});
