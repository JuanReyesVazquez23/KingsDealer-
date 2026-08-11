# Desplegar KingsDealer en Vercel + Neon

## 1. Variables de entorno (Vercel → Project Settings → Environment Variables)

| Variable      | Valor                                                              |
|---------------|---------------------------------------------------------------------|
| `SECRET_KEY`  | Genera una nueva: `python -c "import secrets; print(secrets.token_hex(32))"` |
| `ADMIN_USER`  | Tu usuario de admin                                                 |
| `ADMIN_PASS`  | Tu contraseña de admin                                              |
| `DATABASE_URL`| El connection string **pooled** de Neon (host con `-pooler`), con `?sslmode=require` al final |

La app abre una conexión nueva a Postgres por cada request (correcto para serverless), por eso el connection string debe ser el **pooled** de Neon — si usas el directo, se agotan las conexiones bajo tráfico concurrente.

## 2. Importar el proyecto

1. Sube estos archivos a tu repo de GitHub (reemplazando los que ya existen).
2. En Vercel: **Add New → Project → Import** tu repo.
3. Vercel detecta Flask automáticamente por `requirements.txt` y usa `app.py` como entrypoint (ya tiene el nombre correcto, cero configuración extra). `vercel.json` solo le da 30s de margen a la función para las subidas de fotos.
4. Deploy.

## 3. Qué cambió respecto a Render/Railway

- **`app.py`**: `static_folder` desactivado (Vercel exige servir estáticos desde `/public`, no desde la función Python) y el `os.makedirs` legado ahora está protegido con try/except (el filesystem de la función es de solo lectura fuera de `/tmp`).
- **`static/css`, `static/js`, `static/manifest.json`, `static/icons/`** → movidos a **`public/`** (Vercel los sirve por CDN). **Borra estas carpetas viejas de tu repo**, ya quedaron duplicadas en `public/`.
- **`static/sw.js`** se queda donde está — se sigue sirviendo con la ruta especial en `app.py` para conservar sus headers de caché/service worker.
- Todas las plantillas (`base.html`, `index.html`, `vender.html`) actualizadas para apuntar a `/css/...`, `/js/...`, `/manifest.json`, `/icons/...` en vez de `/static/...`.

## 4. Límite importante de Vercel: 4.5 MB por request

Vercel rechaza cualquier request a una función que pese más de 4.5 MB — es un límite de infraestructura, no se puede subir por configuración. Esto afecta directo la subida de fotos (vehículo o "vender mi carro"). Se mitigó así:

- El recorte de Cropper.js bajó de 2400px/92% a **1600px/82%** (foto normal ahora pesa unos cientos de KB en vez de varios MB).
- `app.js` valida el peso total de las fotos **antes** de enviar el formulario y avisa con un mensaje claro si supera 4 MB, en vez de fallar con un error de red genérico.

Si en el futuro necesitas subir muchas fotos pesadas por vehículo (no solo unas pocas), la solución real es subir directo a un storage externo (Vercel Blob, S3, Cloudinary) en vez de mandarlas por el body del request — eso ya sería un cambio de arquitectura más grande, avísame si lo quieres.

## 5. Desarrollo local con Vercel CLI (opcional)

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
vercel dev
```
