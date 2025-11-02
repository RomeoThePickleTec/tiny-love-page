# Para Ella 💙

Sitio romántico construido con Next.js (App Router) y TypeScript, listo para desplegarse en Vercel. Incluye recordatorios, cuenta regresiva, galería conectada a Supabase y reproductor de Spotify.

## Requisitos previos

- Node.js 18 o superior
- Una cuenta de Supabase con un bucket público llamado `fotos`
- Una tabla `recordatorio` (columnas `titulo`, `fecha`, `mensaje`) y usuarios creados para autenticación con email/contraseña
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

## Supabase

### Storage

1. Crea un bucket público llamado `fotos`.
2. Sube imágenes (idealmente `.jpg` o `.png`).
3. Opcional: agrega metadatos `descripcion` a cada archivo para mostrar un texto personalizado durante el giro.

La galería obtiene los archivos del bucket y genera automáticamente la URL pública, por lo que no necesitas redeployar al agregar nuevas fotos.

### Autenticación y base de datos

1. Habilita el proveedor de correo electrónico/contraseña en Supabase Auth.
2. Crea los usuarios que tendrán acceso (correo y contraseña).
3. Define la tabla `recordatorio` con las columnas:
   - `id` (integer, autoincrement, primary key)
   - `titulo` (text)
   - `fecha` (timestamp)
   - `mensaje` (text)
4. Ajusta las policies para permitir `select` e `insert` a usuarios autenticados.

El sitio mostrará el formulario de inicio de sesión en `/login`. Una vez autenticado, tendrás acceso a la página principal y podrás crear nuevos recordatorios que se guardarán directamente en Supabase.

## Despliegue en Vercel

1. Haz push del proyecto a GitHub.
2. Importa el repositorio en Vercel.
3. Configura las mismas variables de entorno en el proyecto de Vercel.
4. Despliega y disfruta.

## Tecnologías

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS (utilizando estilos globales)
- Supabase Storage y Supabase Auth
- Spotify Embed

Hecho con amor para que puedas seguir actualizando tus recuerdos sin complicaciones.
