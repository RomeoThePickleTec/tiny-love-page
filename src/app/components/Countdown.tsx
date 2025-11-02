"use client";

import { useEffect, useMemo, useState } from "react";

function getTargetDate(): Date | null {
  const targetValue = process.env.NEXT_PUBLIC_TARGET_DATE;
  if (!targetValue) return null;
  const parsed = new Date(targetValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

const pad = (value: number) => value.toString().padStart(2, "0");

export default function Countdown() {
  const target = useMemo(getTargetDate, []);
  const [delta, setDelta] = useState<number>(() =>
    target ? target.getTime() - Date.now() : 0,
  );

  useEffect(() => {
    if (!target) return;
    const update = () => setDelta(target.getTime() - Date.now());
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (!target) {
    return (
      <section style={{ padding: "2rem 1rem" }}>
        <h2>Días restantes para verte</h2>
        <p>Cuenta regresiva no configurada.</p>
      </section>
    );
  }

  const totalSeconds = Math.max(0, Math.floor(delta / 1000));
  const dias = Math.floor(totalSeconds / 86400);
  const horas = Math.floor((totalSeconds % 86400) / 3600);
  const minutos = Math.floor((totalSeconds % 3600) / 60);
  const segundos = totalSeconds % 60;

  return (
    <section
      aria-live="polite"
      style={{ padding: "2rem 1rem", textAlign: "center" }}
    >
      <h2>Días restantes para verte</h2>
      <p style={{ marginBottom: "0.5rem" }}>
        Contando el tiempo para nuestro próximo abrazo.
      </p>
      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gap: "1rem",
          justifyContent: "center",
          fontSize: "1.5rem",
        }}
      >
        <div>
          <span style={{ fontSize: "2.5rem", display: "block" }}>{dias}</span>
          <span style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}>
            días
          </span>
        </div>
        <div>
          <span style={{ fontSize: "2.5rem", display: "block" }}>
            {pad(horas)}
          </span>
          <span style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}>
            horas
          </span>
        </div>
        <div>
          <span style={{ fontSize: "2.5rem", display: "block" }}>
            {pad(minutos)}
          </span>
          <span style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}>
            minutos
          </span>
        </div>
        <div>
          <span style={{ fontSize: "2.5rem", display: "block" }}>
            {pad(segundos)}
          </span>
          <span style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}>
            segundos
          </span>
        </div>
      </div>
    </section>
  );
}
