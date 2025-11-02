export default function SpotifyEmbed() {
  const id = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID;
  if (!id) {
    return (
      <section style={{ padding: "2rem 1rem" }}>
        <h2>Nuestras canciones</h2>
        <p>Lista de reproducción no configurada.</p>
      </section>
    );
  }

  return (
    <section style={{ padding: "2rem 1rem" }}>
      <h2>Nuestras canciones</h2>
      <p>Una banda sonora para cada recuerdo compartido.</p>
      <div style={{ position: "relative", paddingTop: "0.5rem" }}>
        <iframe
          src={`https://open.spotify.com/embed/playlist/${id}`}
          width="100%"
          height="380"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </section>
  );
}
