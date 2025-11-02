"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Recordatorio = {
  id?: string | number;
  titulo: string;
  fecha: string;
  mensaje: string;
};

type RecordatorioRow = {
  id: number;
  titulo: string;
  fecha: string;
  mensaje: string;
};

const formatearFecha = (valor: string) => {
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) {
    return valor;
  }
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(fecha);
};

const convertirFechaISO = (valor: string) => {
  // El input tipo date entrega YYYY-MM-DD; convertimos a ISO conservando la medianoche local.
  const fecha = new Date(`${valor}T00:00:00`);
  if (Number.isNaN(fecha.getTime())) return valor;
  return fecha.toISOString();
};

export default function Recordatorios() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = useMemo(() => {
    if (!supabaseUrl || !supabaseKey) return null;
    return createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
  }, [supabaseUrl, supabaseKey]);

  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [alerta, setAlerta] = useState<string | null>(null);
  const [tipoAlerta, setTipoAlerta] = useState<"info" | "error" | "success" | null>(null);

  const formularioValido = useMemo(
    () =>
      titulo.trim().length > 0 &&
      fecha.trim().length > 0 &&
      mensaje.trim().length > 0,
    [titulo, fecha, mensaje],
  );

  useEffect(() => {
    if (!supabase) {
      setAlerta(
        "Configura las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para cargar tus recordatorios.",
      );
      setTipoAlerta("info");
      setCargando(false);
      return;
    }

    let cancelado = false;

    const cargarRecordatorios = async () => {
      setCargando(true);
      setAlerta(null);
      setTipoAlerta(null);

      const { data, error } = await supabase
        .from("recordatorio")
        .select("id, titulo, fecha, mensaje")
        .order("fecha", { ascending: true });

      if (cancelado) return;

      if (error) {
        console.error("Error al cargar recordatorios:", error);
        setAlerta("No se pudieron cargar los recordatorios en este momento.");
        setTipoAlerta("error");
      } else {
        const registros = ((data as RecordatorioRow[] | null) ?? []).map((item) => ({
          id: item.id,
          titulo: item.titulo,
          fecha: item.fecha,
          mensaje: item.mensaje,
        }));
        setRecordatorios(registros);
      }

      setCargando(false);
    };

    void cargarRecordatorios();

    return () => {
      cancelado = true;
    };
  }, [supabase]);

  const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!formularioValido || !supabase) return;

    setGuardando(true);
    setAlerta(null);
    setTipoAlerta(null);

    const { data, error } = await supabase
      .from("recordatorio")
      .insert([
        {
          titulo: titulo.trim(),
          fecha: convertirFechaISO(fecha.trim()),
          mensaje: mensaje.trim(),
        },
      ])
      .select("id, titulo, fecha, mensaje")
      .single();

    if (error) {
      console.error("Error al guardar el recordatorio:", error);
      setAlerta("No se pudo guardar tu recordatorio. Intenta nuevamente.");
      setTipoAlerta("error");
    } else if (data) {
      const registro = data as RecordatorioRow;
      setRecordatorios((actuales) =>
        [...actuales, registro].sort(
          (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
        ),
      );
      setTitulo("");
      setFecha("");
      setMensaje("");
      setAlerta("Recordatorio guardado y almacenado en Supabase.");
      setTipoAlerta("success");
    }

    setGuardando(false);
  };

  const mostrarMensaje = alerta && (
    <p
      style={{
        margin: 0,
        fontSize: "0.9rem",
        padding: "0.75rem 1rem",
        borderRadius: "12px",
        backgroundColor:
          tipoAlerta === "error"
            ? "rgba(239, 68, 68, 0.15)"
            : tipoAlerta === "success"
              ? "rgba(16, 185, 129, 0.15)"
              : "rgba(79, 70, 229, 0.08)",
        color:
          tipoAlerta === "error"
            ? "#b91c1c"
            : tipoAlerta === "success"
              ? "#0f766e"
              : "#3730a3",
      }}
    >
      {alerta}
    </p>
  );

  const supabaseNoDisponible = !supabase;

  return (
    <section style={{ padding: "2rem 1rem" }}>
      <h2>Recordatorios</h2>
      <p>
        Historias breves para que nunca olvidemos los detalles que nos hicieron
        enamorarnos una y otra vez.
      </p>

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          marginTop: "1.5rem",
        }}
      >
        <form
          onSubmit={manejarEnvio}
          style={{
            display: "grid",
            gap: "0.75rem",
            padding: "1.5rem",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(239, 246, 255, 0.75), rgba(209, 213, 255, 0.85))",
            boxShadow: "0 12px 28px rgba(79, 70, 229, 0.1)",
          }}
        >
          <h3 style={{ margin: 0 }}>Agregar un nuevo recordatorio</h3>
          <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8 }}>
            Tus palabras se guardarán directamente en la tabla <code>recordatorio</code> de Supabase.
          </p>
          {mostrarMensaje}
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span>Título</span>
            <input
              value={titulo}
              onChange={(evento) => setTitulo(evento.target.value)}
              placeholder="Un recuerdo inolvidable"
              disabled={supabaseNoDisponible || guardando}
              style={{
                borderRadius: "8px",
                border: "1px solid rgba(79, 70, 229, 0.3)",
                padding: "0.65rem 0.75rem",
                backgroundColor: supabaseNoDisponible ? "rgba(148, 163, 184, 0.15)" : "white",
              }}
            />
          </label>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span>Fecha</span>
            <input
              type="date"
              value={fecha}
              onChange={(evento) => setFecha(evento.target.value)}
              disabled={supabaseNoDisponible || guardando}
              style={{
                borderRadius: "8px",
                border: "1px solid rgba(79, 70, 229, 0.3)",
                padding: "0.65rem 0.75rem",
                backgroundColor: supabaseNoDisponible ? "rgba(148, 163, 184, 0.15)" : "white",
              }}
            />
          </label>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span>Mensaje</span>
            <textarea
              value={mensaje}
              onChange={(evento) => setMensaje(evento.target.value)}
              rows={4}
              placeholder="Escribe una carta corta llena de cariño..."
              disabled={supabaseNoDisponible || guardando}
              style={{
                borderRadius: "8px",
                border: "1px solid rgba(79, 70, 229, 0.3)",
                padding: "0.75rem",
                resize: "vertical",
                backgroundColor: supabaseNoDisponible ? "rgba(148, 163, 184, 0.1)" : "white",
              }}
            />
          </label>
          <button
            type="submit"
            disabled={!formularioValido || supabaseNoDisponible || guardando}
            style={{
              border: "none",
              borderRadius: "9999px",
              padding: "0.75rem 1.5rem",
              fontWeight: 600,
              background:
                !supabaseNoDisponible && formularioValido
                  ? "linear-gradient(135deg, #6366f1, #ec4899)"
                  : "rgba(79, 70, 229, 0.35)",
              color: "white",
              cursor:
                !supabaseNoDisponible && formularioValido && !guardando
                  ? "pointer"
                  : "not-allowed",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow:
                !supabaseNoDisponible && formularioValido
                  ? "0 10px 25px rgba(79, 70, 229, 0.35)"
                  : "none",
              opacity: guardando ? 0.8 : 1,
            }}
          >
            {guardando ? "Guardando..." : "Guardar en el corazón"}
          </button>
        </form>

        <div
          style={{
            display: "grid",
            gap: "1.25rem",
          }}
        >
          {cargando && <p>Cargando recuerdos escritos...</p>}
          {!cargando && recordatorios.length === 0 && (
            <p style={{ opacity: 0.7 }}>
              Aún no hay recordatorios guardados, pero este espacio espera tus mensajes.
            </p>
          )}
          {recordatorios.map((recordatorio) => (
            <article
              key={recordatorio.id ?? `${recordatorio.titulo}-${recordatorio.fecha}`}
              style={{
                padding: "1.5rem",
                borderRadius: "16px",
                background: "white",
                boxShadow: "0 16px 32px rgba(15, 23, 42, 0.08)",
                border: "1px solid rgba(148, 163, 184, 0.18)",
              }}
            >
              <header
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                  marginBottom: "0.75rem",
                }}
              >
                <h3 style={{ margin: 0 }}>{recordatorio.titulo}</h3>
                <time
                  dateTime={recordatorio.fecha}
                  style={{ fontSize: "0.95rem", opacity: 0.7 }}
                >
                  {formatearFecha(recordatorio.fecha)}
                </time>
              </header>
              <p style={{ margin: 0, lineHeight: 1.6 }}>{recordatorio.mensaje}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
