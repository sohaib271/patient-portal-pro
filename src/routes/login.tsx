import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthService } from "@/services/authService";
import { useUser } from "@/hooks/useUser";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — MediFlow" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isLoading: isLoadingUser } = useUser();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    navigate({
      to: user.role === "patient" ? "/patient/dashboard" : "/dashboard",
      replace: true,
    });
  }, [navigate, user]);

  const getErrorMessage = (err: unknown) => {
    if (typeof err === "object" && err && "response" in err) {
      const response = (err as { response?: { data?: { message?: string | string[] } } }).response;
      const message = response?.data?.message;
      return Array.isArray(message) ? message.join(", ") : message;
    }
    return undefined;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await AuthService.login(email.trim(), password);
      queryClient.setQueryData(["user"], user);
      navigate({ to: user?.role === "patient" ? "/patient/dashboard" : "/dashboard" });
    } catch (err) {
      setError(getErrorMessage(err) ?? "Unable to sign in. Please check your email and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-100">
        <p className="text-sm text-muted-foreground">
          {user ? "Redirecting to your dashboard..." : "Checking your session..."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-sky-100 px-4">
      {/* Decorative DNA-like bg */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" fill="none">
          <defs>
            <radialGradient id="g1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgb(14 165 233 / 0.18)" />
              <stop offset="100%" stopColor="rgb(14 165 233 / 0)" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="220" fill="url(#g1)" />
          <circle cx="1000" cy="600" r="280" fill="url(#g1)" />
          {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx={80 + i * 80} cy={400 + Math.sin(i) * 80} r="4" fill="rgb(14 165 233 / 0.3)" />
          ))}
        </svg>
      </div>

      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-2xl border border-white/60 bg-white/80 p-8 shadow-[0_30px_80px_-20px_rgba(14,165,233,0.25)] backdrop-blur-xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <Plus className="h-8 w-8" strokeWidth={3} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">MediFlow</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address/Phone no</Label>
              <Input id="text" type="text" placeholder="you@clinic.com/0344444444" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pwd">Password</Label>
              <div className="relative">
                <Input id="pwd" type={show ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox /> Remember me
              </label>
              <a className="text-sm font-medium text-primary hover:underline" href="#">Forgot password?</a>
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            New patient?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">MediFlow © 2026 — All rights reserved</p>
      </div>
    </div>
  );
}
