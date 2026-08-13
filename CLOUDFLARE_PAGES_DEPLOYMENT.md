# Guía de Despliegue en Cloudflare Pages

Cloudflare Pages es una plataforma rápida y gratuita para alojar sitios web estáticos. Hay dos formas principales de subir tu página web: mediante el panel de control (subida directa) o conectando un repositorio de Git (GitHub/GitLab).

## Opción 1: Subida Directa (Más fácil y rápido)

Esta es la forma más rápida de publicar tu página si no usas Git.

1. **Inicia sesión** en tu cuenta de [Cloudflare](https://dash.cloudflare.com/). Si no tienes una, regístrate (es gratis).
2. En el menú de la izquierda de tu panel, haz clic en **"Workers & Pages"**.
3. Haz clic en el botón azul **"Create application"** (Crear aplicación).
4. Selecciona la pestaña **"Pages"**.
5. Haz clic en **"Upload assets"** (Subir activos).
6. Ponle un nombre a tu proyecto (esto será parte de tu URL, por ejemplo: `mi-proyecto.pages.dev`) y haz clic en **"Create project"**.
7. Arrastra y suelta todos los archivos de tu página web (incluyendo tu `index.html` y cualquier otra carpeta o archivo) en el área designada, o haz clic para seleccionarlos desde tu computadora. Asegúrate de subir la carpeta principal que los contiene o los archivos directamente.
8. Una vez que los archivos se hayan subido, haz clic en **"Deploy site"** (Desplegar sitio).
9. ¡Listo! Cloudflare te dará un enlace (ej. `https://tu-proyecto.pages.dev`) donde tu sitio ya está en vivo.

## Opción 2: Usando Git (Recomendado para actualizaciones continuas)

Si tienes tu código en GitHub o GitLab, puedes conectarlo para que cada vez que hagas un cambio, el sitio se actualice automáticamente.

1. **Inicia sesión** en [Cloudflare](https://dash.cloudflare.com/).
2. Ve a **"Workers & Pages"** en el menú izquierdo.
3. Haz clic en **"Create application"** y luego en la pestaña **"Pages"**.
4. Haz clic en **"Connect to Git"**.
5. Selecciona tu proveedor (GitHub o GitLab) y autoriza a Cloudflare para acceder a tus repositorios.
6. Selecciona el repositorio de tu proyecto y haz clic en **"Begin setup"**.
7. En la configuración de compilación (Build settings):
   * **Project name:** Elige el nombre de tu proyecto.
   * **Production branch:** Generalmente es `main` o `master`.
   * **Framework preset:** Como es una página estática simple, selecciona **"None"**.
   * **Build command:** Déjalo en blanco.
   * **Build output directory:** Déjalo en blanco (o pon el nombre de la carpeta si tu `index.html` está dentro de una).
8. Haz clic en **"Save and Deploy"** (Guardar y Desplegar).
9. Cloudflare construirá y publicará tu sitio y te proporcionará una URL.

### Dominio Personalizado (Opcional)
Si tienes un dominio propio (ej. `midominio.com`), una vez que el proyecto esté desplegado, puedes ir a la pestaña **"Custom domains"** (Dominios personalizados) dentro de tu proyecto en Cloudflare Pages y seguir las instrucciones para conectarlo.
