"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseClient";

export default function SignOutButton() {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);

  const manejarSalida = async () => {
    setCargando(true);
    try {
      const supabase = getSupabaseBrowser();
      await supabase.auth.signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setCargando(false);
    }
  };

  return (
    <button
      type="button"
      onClick={manejarSalida}
      disabled={cargando}
      style={{
        border: "none",
        borderRadius: "9999px",
        padding: "0.4rem 1rem",
        fontSize: "0.85rem",
        fontWeight: 500,
        background: cargando
          ? "rgba(79, 70, 229, 0.35)"
          : "linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(236, 72, 153, 0.85))",
        color: "white",
        cursor: cargando ? "not-allowed" : "pointer",
        boxShadow: "0 10px 20px rgba(79, 70, 229, 0.25)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {cargando ? "Saliendo..." : "Cerrar sesión"}
    </button>
  );
}
