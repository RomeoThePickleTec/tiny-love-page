import About from "./components/About";
import Countdown from "./components/Countdown";
import Galeria from "./components/Galeria";
import Recordatorios from "./components/Recordatorios";
import SpotifyEmbed from "./components/SpotifyEmbed";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "3rem 1.5rem 4rem",
        fontFamily:
          "var(--font-geist-sans, 'Helvetica Neue', 'Segoe UI', system-ui, -apple-system, sans-serif)",
        color: "#0f172a",
      }}
    >
      <header
        style={{
          textAlign: "center",
          padding: "3rem 1rem 2rem",
        }}
      >
        <p
          style={{
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            fontSize: "0.75rem",
            opacity: 0.7,
            marginBottom: "1rem",
          }}
        >
          Nuestro álbum dinámico, donde sea, a la hora que sea, como sea.
        </p>
        <h1
          style={{
            fontSize: "3rem",
            marginBottom: "0.75rem",
            fontWeight: 700,
          }}
        >
          Para Dani 💙
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8 }}>
          Un pequeño recordatorio de lo mucho que significas para mí.
        </p>
      </header>

      <Countdown />
      <Recordatorios />
      <Galeria />
      <SpotifyEmbed />
      <About />

      <footer
        style={{
          padding: "2rem 1rem",
          textAlign: "center",
          opacity: 0.65,
          marginTop: "3rem",
          fontSize: "0.95rem",
        }}
      >
        Hecho con amor, actualizado mutuamente.
      </footer>
    </main>
  );
}
