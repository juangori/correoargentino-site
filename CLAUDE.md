# Correo Argentino Pro - Website

## Resumen
Sitio web comercial para el plugin Correo Argentino Pro. Landing page con cotizador, sistema de reviews, pricing con checkout via Mercado Pago, y panel admin.

## Stack
- **HTML/CSS/JS** estatico (no framework, no build step)
- Hosting: GitHub Pages con dominio custom `correoargentinopro.com`
- Backend API: `https://api.correoargentinopro.com` (separado, no en este repo)
- Font: Outfit (Google Fonts)
- Analytics: Google Tag Manager (GTM-5PL6T2RH)

## Estructura de archivos
```
index.html          # Landing page: hero, features, cotizador, reviews, pricing, checkout flow
admin.html          # Panel admin: licencias, mensajes, resenas, descuentos (auth via API secret)
styles.css          # Estilos globales (dark theme)
contacto.html       # Formulario de contacto
ayuda.html          # Documentacion / guia de uso
faqs.html           # Preguntas frecuentes
terminos.html       # Terminos y condiciones
privacidad.html     # Politica de privacidad
blog/               # Blog posts estaticos (SEO)
  index.html        # Listado de posts
  *.html            # Posts individuales
sitemap.xml         # Sitemap para SEO
robots.txt          # Robots config
favicon.svg         # Favicon SVG
og-image.png        # Open Graph image
CNAME               # GitHub Pages custom domain
```

## API Endpoints usados (backend separado)
- `POST /checkout/create` — Crea preferencia de pago en Mercado Pago
- `POST /checkout/renew` — Crea pago de renovacion
- `GET /checkout/success?payment_id=` — Obtiene licencia post-pago
- `GET /download/{license_key}` — Descarga del plugin
- `POST /cotizar` — Cotiza envios (proxy a MiCorreo API)
- `GET /reviews` — Reviews aprobadas (publico)
- `POST /contact` — Formulario de contacto
- **Admin** (requiere Bearer token):
  - `GET /admin/stats`, `/admin/licenses`, `/admin/license/{key}`
  - `PUT /admin/license/{key}` (revoke/reactivate/extend)
  - `POST /admin/license/create`
  - `GET/DELETE /admin/messages`
  - `GET/POST/PUT/DELETE /admin/reviews`
  - `GET/POST/PUT/DELETE /admin/discounts`

## Convenciones
- CSS: variables en :root, dark theme, responsive con media queries
- JS: vanilla ES5 (compatibilidad), funciones globales expuestas via `window.*` en admin
- HTML: inline styles en cotizador (legacy), clases BEM-like en el resto
- XSS: usar `escapeHtml()` (admin) o `hEsc()` (index) para todo contenido dinamico en innerHTML
- Cotizador: rate limit client-side de 3 segundos entre requests

## Seguridad
- Admin auth: Bearer token en header Authorization, almacenado en sessionStorage
- Checkout: precio determinado por el backend, NO se envia desde el frontend
- XSS: todo contenido de API se escapa antes de insertar en DOM
- Cotizador: cooldown de 3s entre requests para evitar spam
- Reviews publicas: `comment` y `name` escapados con `.replace(/</g, '&lt;')`

## Notas
- El precio se muestra en el frontend solo para display (`PRICE_ARS`), pero el backend lo determina al crear la preferencia de MP
- El panel admin esta en `admin.html` con `noindex, nofollow`
- La renovacion se inicia desde el plugin WP con query param `?renew={license_key}`
- Los reviews del homepage se cargan via API y se renderizan client-side con schema.org AggregateRating
