import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("Email ou senha incorretos.");
    } else {
      navigate("/admin/dashboard");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "oklch(var(--c-bg))" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p
            className="font-script text-3xl mb-1"
            style={{ color: "oklch(var(--c-primary))" }}
          >
            Delicias Ayumi
          </p>
          <p className="text-sm" style={{ color: "oklch(var(--c-fg-soft))" }}>
            Área administrativa
          </p>
        </div>

        <div
          className="rounded-2xl border p-6"
          style={{
            background: "oklch(var(--c-surface))",
            borderColor: "oklch(var(--c-line-soft))",
          }}
        >
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ayumi@email.com"
              required
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && (
              <p className="text-sm text-center" style={{ color: "oklch(var(--c-danger))" }}>
                {error}
              </p>
            )}
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
