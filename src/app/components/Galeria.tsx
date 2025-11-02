"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import styles from "./Galeria.module.css";

type Foto = { src: string; descripcion: string };

const BUCKET = "love-files";

const formatDescripcion = (nombre: string, metaDescripcion?: unknown) => {
  if (typeof metaDescripcion === "string" && metaDescripcion.trim().length > 0) {
    return metaDescripcion.trim();
  }
  return nombre
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]/g, " ")
    .trim();
};

export default function Galeria() {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [seleccionada, setSeleccionada] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<"info" | "error" | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (!supabaseUrl || !supabaseKey) {
      setMensaje("Configura Supabase para mostrar la galería.");
      setTipoMensaje("info");
      setCargando(false);
      return;
    }

    const cliente = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const cargarFotos = async () => {
      setCargando(true);
      setMensaje(null);
      setTipoMensaje(null);
      const { data, error } = await cliente.storage
        .from(BUCKET)
        .list(undefined, {
          limit: 100,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) {
        console.error("Error al cargar las fotos de Supabase:", error);
        setMensaje("No se pudieron cargar las fotos en este momento.");
        setTipoMensaje("error");
        setCargando(false);
        return;
      }

      const items = (data ?? []).filter(
        (item) => !item.name.startsWith(".") && !item.name.endsWith("/"),
      );
      const construidas = items.map<Foto>((item) => {
        const path = encodeURIComponent(item.name).replace(/%2F/g, "/");
        const metadata = item.metadata as Record<string, unknown> | undefined;
        return {
          src: `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`,
          descripcion: formatDescripcion(item.name, metadata?.descripcion),
        };
      });

      setFotos(construidas);
      setSeleccionada(null);
      setTipoMensaje(null);
      setCargando(false);
    };

    cargarFotos();
  }, [supabaseUrl, supabaseKey]);

  const toggleSeleccion = (index: number) => {
    setSeleccionada((actual) => (actual === index ? null : index));
  };

  return (
    <section style={{ padding: "2rem 1rem" }}>
      <h2>Galería</h2>
      <p>Capturas de instantes que quiero revivir contigo.</p>
      {cargando && <p>Cargando recuerdos visuales...</p>}
      {mensaje && !cargando && (
        <p
          className={tipoMensaje === "error" ? styles.error : styles.empty}
        >
          {mensaje}
        </p>
      )}
      {!cargando && !mensaje && fotos.length === 0 && (
        <p className={styles.empty}>
          Aún no hay fotos, pero pronto llenaremos este espacio.
        </p>
      )}

      <div className={styles.grid}>
        {fotos.map((foto, index) => {
          const estaActiva = seleccionada === index;
          return (
            <button
              type="button"
              key={foto.src}
              className={`${styles.card} ${estaActiva ? styles.flipped : ""}`}
              onClick={() => toggleSeleccion(index)}
              aria-pressed={estaActiva}
            >
              <div className={styles.inner}>
                <div className={styles.front}>
                  <img src={foto.src} alt={foto.descripcion || "Recuerdo"} />
                </div>
                <div className={styles.back}>
                  <p>{foto.descripcion || "Nuestro momento especial"}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
