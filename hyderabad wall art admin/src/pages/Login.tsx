import { motion } from "framer-motion";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async () => {
    const normalized = email.trim();

    if (!normalized) {
      setError("Enter your username or email.");
      return;
    }

    if (password.trim().length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await login(normalized, password);
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <Card className="panel-luxury overflow-hidden">
          <CardContent className="space-y-6 p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <BrandLogo size={72} />
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Admin access</h1>
                <p className="mt-2 text-sm text-muted-foreground">Sign in to manage Hyderabad Wall Arts content and leads.</p>
              </div>
            </div>
            <div className="space-y-4" onKeyDown={async (event) => {
              if (event.key === "Enter") await handleSubmit();
            }}>
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email or username" type="text" />
              <Input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" />
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button variant="luxury" className="w-full" disabled={loading} onClick={handleSubmit}>
                {loading ? "Signing in..." : "Enter dashboard"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
