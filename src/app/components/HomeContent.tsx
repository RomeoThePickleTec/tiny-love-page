import About from "./About";
import Countdown from "./Countdown";
import Galeria from "./Galeria";
import Recordatorios from "./Recordatorios";
import SignOutButton from "./SignOutButton";
import SpotifyEmbed from "./SpotifyEmbed";

export default function HomeContent() {
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
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "2rem",
            right: "1.5rem",
          }}
        >
          <SignOutButton />
        </div>
        <p
          style={{
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            fontSize: "0.75rem",
            opacity: 0.7,
            marginBottom: "1rem",
          }}
        >
          Nuestro refugio digital
        </p>
        <h1
          style={{
            fontSize: "3rem",
            marginBottom: "0.75rem",
            fontWeight: 700,
          }}
        >
          Para Ella 💙
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.8 }}>
          Un pequeño lugar para nuestros momentos.
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
        Hecho con amor, actualizado a menudo.
      </footer>
    </main>
  );
}
