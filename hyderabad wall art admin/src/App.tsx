import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { useAuth } from "@/lib/auth";
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const AuthEntryRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/admin/dashboard" : "/login"} replace />;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" richColors />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<AuthEntryRedirect />} />
              <Route path="/home" element={<AuthEntryRedirect />} />
              <Route path="/commercial" element={<AuthEntryRedirect />} />
              <Route path="/mural" element={<AuthEntryRedirect />} />
              <Route path="/stencil" element={<AuthEntryRedirect />} />
              <Route path="/about" element={<AuthEntryRedirect />} />
              <Route path="/contact" element={<AuthEntryRedirect />} />
              <Route path="/blogs/:slug" element={<AuthEntryRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/profile" element={<AdminDashboard />} />
              <Route path="/admin/blogs" element={<AdminDashboard />} />
              <Route path="/admin/categories" element={<AdminDashboard />} />
              <Route path="/admin/videos" element={<AdminDashboard />} />
              <Route path="/admin/services" element={<AdminDashboard />} />
              <Route path="/admin/pages" element={<AdminDashboard />} />
              <Route path="/admin/testimonials" element={<AdminDashboard />} />
              <Route path="/admin/contacts" element={<AdminDashboard />} />
              <Route path="/admin/settings" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AdminThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
