# Para Ella 💙

Sitio romántico construido con Next.js (App Router) y TypeScript, listo para desplegarse en Vercel. Incluye recordatorios, cuenta regresiva, galería conectada a Supabase y reproductor de Spotify.

## Requisitos previos

- Node.js 18 o superior
- Una cuenta de Supabase con un bucket público llamado `fotos`
- Una lista de reproducción de Spotify pública o compartible

## Variables de entorno

Crea un archivo `.env.local` (y replica los valores en Vercel) con:

```
NEXT_PUBLIC_TARGET_DATE=2025-12-24T00:00:00-06:00
NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID=tu_playlist_id
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_llave_anon
```

> Ajusta los valores para reflejar tu fecha especial y tus credenciales reales.

## Desarrollo local

Instala dependencias y arranca el servidor:

```bash
npm install
npm run dev
```

Luego visita [http://localhost:3000](http://localhost:3000).

## Supabase Storage

1. Crea un bucket público llamado `fotos`.
2. Sube imágenes (idealmente `.jpg` o `.png`).
3. Opcional: agrega metadatos `descripcion` a cada archivo para mostrar un texto personalizado durante el giro.

La galería obtiene los archivos del bucket y genera automáticamente la URL pública, por lo que no necesitas redeployar al agregar nuevas fotos.

## Despliegue en Vercel

1. Haz push del proyecto a GitHub.
2. Importa el repositorio en Vercel.
3. Configura las mismas variables de entorno en el proyecto de Vercel.
4. Despliega y disfruta.

## Tecnologías

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS (utilizando estilos globales)
- Supabase Storage
- Spotify Embed

Hecho con amor para que puedas seguir actualizando tus recuerdos sin complicaciones.
