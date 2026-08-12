KingsDealer

<p align="center">
  <strong>Plataforma moderna para compra, venta y gestión de vehículos</strong>
</p><p align="center">
  Desarrollada para el mercado automotriz de República Dominicana 🇩🇴
</p><p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Flask-3.1-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask">
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
</p><p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA">
  <img src="https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=postgresql&logoColor=black" alt="Neon">
</p>---

Sobre el proyecto

KingsDealer es una plataforma web full-stack orientada a la comercialización de vehículos.

El proyecto combina un backend desarrollado con Python + Flask, una interfaz web responsive construida con HTML, CSS y JavaScript, y una base de datos PostgreSQL.

La aplicación está preparada para ejecutarse en una arquitectura serverless con Vercel, utilizando Neon PostgreSQL como infraestructura de base de datos.

Funcionalidades

🚘 Catálogo de vehículos

- Visualización dinámica de vehículos.
- Información detallada de cada vehículo.
- Marca, modelo, año y tipo.
- Precio en DOP o USD.
- Sistema de ofertas.
- Precio especial para vehículos en oferta.
- Galería de imágenes.
- Filtros por categoría.
- Información de contacto.

📸 Publicación de vehículos

Los usuarios pueden enviar vehículos para ser publicados en la plataforma.

El formulario permite introducir:

- Información del vendedor.
- Teléfono.
- WhatsApp.
- Marca.
- Modelo.
- Año.
- Tipo de vehículo.
- Precio.
- Moneda.
- Condición.
- Descripción.
- Imágenes.

Las publicaciones quedan almacenadas con un estado que permite su posterior gestión.

🔐 Administración

El proyecto cuenta con autenticación para el administrador y herramientas para gestionar el contenido de la plataforma.

Incluye:

- Gestión de vehículos.
- Gestión de publicaciones.
- Gestión de ofertas.
- Gestión de imágenes.
- Configuración del mapa.
- Aprobación de publicaciones.
- Eliminación de contenido.
- Control de acceso mediante sesiones.

🗺️ Ubicación dinámica

La ubicación mostrada en la plataforma se almacena en PostgreSQL y puede ser modificada mediante la configuración administrativa.

La configuración incluye:

Latitud
Longitud
Nombre de la ubicación

📱 Progressive Web App

KingsDealer incorpora características de PWA para ofrecer una experiencia más cercana a una aplicación nativa.

- Web App Manifest.
- Service Worker.
- Página offline.
- Iconos para dispositivos.
- Soporte para instalación.
- Caché de recursos.
- Experiencia responsive.

API REST

El backend expone una API para trabajar con los recursos principales de la aplicación.

Vehículos

GET    /api/vehiculos
POST   /api/vehiculos
PUT    /api/vehiculos/<id>
DELETE /api/vehiculos/<id>

Anuncios

GET    /api/anuncios
POST   /api/anuncios
PUT    /api/anuncios/<id>
DELETE /api/anuncios/<id>

Ofertas

GET    /api/ofertas

Configuración

GET    /api/config/mapa
PUT    /api/config/mapa

Health Check

GET /healthz

Arquitectura

                    ┌─────────────────────┐
                    │       Usuario       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Vercel        │
                    │     Serverless      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Flask         │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Neon PostgreSQL   │
                    │      Database       │
                    └─────────────────────┘

Los recursos estáticos se sirven mediante Vercel, mientras que Flask se encarga de la lógica del backend y las rutas dinámicas.

Tecnologías

<p align="center">
  <img src="https://skillicons.dev/icons?i=python,flask,postgresql,js,html,css,vercel&perline=7" alt="Tech Stack">
</p>Tecnología| Uso
🐍 Python| Lenguaje principal del backend
⚗️ Flask| Framework web
🐘 PostgreSQL| Base de datos
🟨 JavaScript| Interactividad del frontend
🌐 HTML5| Estructura de la interfaz
🎨 CSS3| Diseño y responsive UI
▲ Vercel| Hosting y serverless functions
⚡ Neon| PostgreSQL serverless
📱 PWA| Experiencia instalable

Estructura

kingsdealer-vercel/
│
├── app.py
├── vercel.json
├── .env.example
├── .python-version
│
├── public/
│   ├── css/
│   │   └── styles.css
│   │
│   ├── js/
│   │   └── app.js
│   │
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   │
│   └── manifest.json
│
├── static/
│   └── sw.js
│
└── templates/
    ├── base.html
    ├── index.html
    └── vender.html

Base de datos

KingsDealer utiliza PostgreSQL mediante "psycopg2".

Las principales tablas utilizadas por la aplicación son:

vehiculos
│
├── Información del vehículo
├── Precio
├── Moneda
├── Ofertas
└── Imágenes

anuncios_clientes
│
├── Información del vendedor
├── Información del vehículo
├── Precio
├── Condición
├── Imágenes
└── Estado

imagenes
│
└── Imágenes almacenadas de forma persistente

configuracion
│
└── Configuración dinámica de la plataforma

Las imágenes se almacenan en PostgreSQL como datos codificados, evitando depender del almacenamiento efímero de las funciones serverless.

Seguridad

El backend implementa diferentes mecanismos de protección:

- Sesiones protegidas.
- Cookies "HTTPOnly".
- Cookies "Secure".
- Política "SameSite".
- Autenticación administrativa.
- Rutas administrativas protegidas.
- Variables sensibles mediante environment variables.
- Sanitización de datos.
- Validación de archivos.
- Restricción de extensiones de imágenes.
- Límite de tamaño de uploads.
- Validación de datos recibidos por la API.

Las credenciales y secretos deben mantenerse fuera del repositorio.

Serverless

El proyecto está adaptado para ejecutarse como una función serverless en Vercel.

Request
   │
   ▼
Vercel
   │
   ▼
Flask Function
   │
   ▼
PostgreSQL / Neon

Esto permite ejecutar el backend sin mantener un servidor tradicional permanentemente activo.

Responsive Design

La interfaz está diseñada para adaptarse a diferentes tamaños de pantalla:

- 📱 Smartphones
- 📲 Tablets
- 💻 Laptops
- 🖥️ Desktop

El frontend utiliza CSS y JavaScript vanilla, manteniendo una arquitectura ligera sin depender de un framework frontend adicional.

Estado del proyecto

En desarrollo activo.

KingsDealer continúa evolucionando con nuevas funcionalidades para mejorar la gestión de vehículos, publicaciones y experiencia de usuario.

Autor

Juan Reyes

Desarrollador enfocado en Web Development, trabajando principalmente con Python, Flask, JavaScript, React y PostgreSQL.

🇩🇴 República Dominicana

---

<p align="center">
  <strong>KingsDealer</strong>
  <br>
  Built with Python, Flask & PostgreSQL
</p>
