"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseClient";

function LoginScreenFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem",
        opacity: 0.7,
      }}
    >
      Cargando acceso seguro...
    </div>
  );
}

function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabaseDisponible, setSupabaseDisponible] = useState(true);

  const redirectTo = useMemo(() => {
    const redirect = searchParams.get("redirect");
    if (!redirect) return "/";
    try {
      const decoded = decodeURIComponent(redirect);
      return decoded.startsWith("/") ? decoded : "/";
    } catch {
      return "/";
    }
  }, [searchParams]);

  useEffect(() => {
    let activo = true;
    try {
      const supabase = getSupabaseBrowser();
      supabase
        .auth.getSession()
        .then(({ data }) => {
          if (!activo) return;
          if (data.session) {
            router.replace(redirectTo);
          }
        })
        .catch((err) => {
          console.error("Error verificando sesión:", err);
        });
    } catch (err) {
      console.error(err);
      setSupabaseDisponible(false);
    }

    return () => {
      activo = false;
    };
  }, [redirectTo, router]);

  const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setError(null);

    let supabase;
    try {
      supabase = getSupabaseBrowser();
    } catch (err) {
      console.error(err);
      setSupabaseDisponible(false);
      setError(
        "Supabase no está configurado. Verifica tus variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return;
    }

    setCargando(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setCargando(false);

    if (authError) {
      console.error("Error al iniciar sesión:", authError);
      setError("No pudimos iniciar sesión con esas credenciales.");
      return;
    }

    router.replace(redirectTo);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background:
          "radial-gradient(circle at top, rgba(236, 72, 153, 0.18), transparent 55%), radial-gradient(circle at bottom, rgba(99, 102, 241, 0.18), transparent 55%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "2.5rem",
          borderRadius: "24px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 32px 70px rgba(79, 70, 229, 0.18)",
          backdropFilter: "blur(14px)",
        }}
      >
        <h1
          style={{
            margin: "0 0 0.5rem",
            fontSize: "2rem",
            textAlign: "center",
          }}
        >
          Bienvenida de nuevo 💌
        </h1>
        <p style={{ margin: "0 0 2rem", textAlign: "center", opacity: 0.7 }}>
          Ingresa para seguir guardando nuestros recuerdos.
        </p>

        {!supabaseDisponible && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#991b1b",
              fontSize: "0.95rem",
            }}
          >
            Falta configurar la conexión con Supabase.
          </div>
        )}

        {error && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              color: "#b91c1c",
              fontSize: "0.95rem",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={manejarEnvio}
          style={{ display: "grid", gap: "1rem" }}
        >
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span>Correo electrónico</span>
            <input
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              placeholder="tu-correo@ejemplo.com"
              autoComplete="email"
              required
              style={{
                borderRadius: "10px",
                border: "1px solid rgba(79, 70, 229, 0.35)",
                padding: "0.7rem 0.75rem",
              }}
            />
          </label>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span>Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(evento) => setPassword(evento.target.value)}
              placeholder="Tu contraseña secreta"
              autoComplete="current-password"
              required
              style={{
                borderRadius: "10px",
                border: "1px solid rgba(79, 70, 229, 0.35)",
                padding: "0.7rem 0.75rem",
              }}
            />
          </label>
          <button
            type="submit"
            disabled={cargando}
            style={{
              border: "none",
              borderRadius: "9999px",
              padding: "0.85rem 1.4rem",
              fontWeight: 600,
              background: cargando
                ? "rgba(79, 70, 229, 0.35)"
                : "linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(236, 72, 153, 0.9))",
              color: "white",
              cursor: cargando ? "not-allowed" : "pointer",
              boxShadow: "0 20px 40px rgba(79, 70, 229, 0.25)",
            }}
          >
            {cargando ? "Iniciando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginScreenFallback />}>
      <LoginScreen />
    </Suspense>
  );
}
