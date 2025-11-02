"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseClient";

type EstadoAuth = "verificando" | "autenticado" | "no-autenticado";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [estado, setEstado] = useState<EstadoAuth>("verificando");

  useEffect(() => {
    let activo = true;
    let supabase;

    try {
      supabase = getSupabaseBrowser();
    } catch (error) {
      console.error(error);
      setEstado("no-autenticado");
      router.replace("/login");
      return;
    }

    const handleSession = (sesion: unknown) => {
      if (!activo) return;
      if (sesion) {
        setEstado("autenticado");
      } else {
        setEstado("no-autenticado");
        const redirect = pathname && pathname !== "/login" ? `?redirect=${encodeURIComponent(pathname)}` : "";
        router.replace(`/login${redirect}`);
      }
    };

    supabase.auth
      .getSession()
      .then(({ data }) => {
        handleSession(data.session ?? null);
      })
      .catch((error) => {
        console.error("Error verificando la sesión:", error);
        handleSession(null);
      });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session ?? null);
    });

    return () => {
      activo = false;
      subscription?.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (estado === "verificando") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
          opacity: 0.8,
        }}
      >
        Verificando tu acceso...
      </div>
    );
  }

  if (estado === "autenticado") {
    return <>{children}</>;
  }

  return null;
}
