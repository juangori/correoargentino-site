> Fuente: https://correoargentinopro.com/blog/woocommerce-argentina-guia-completa.html

# WooCommerce en Argentina: Guía completa para vender online

> Guía definitiva para armar tu tienda con WooCommerce en Argentina. Medios de pago, envíos, facturación, impuestos, plugins esenciales y configuración paso a paso.

Armar una tienda online en Argentina tiene sus particularidades: medios de pago locales, operadores logísticos con sus propias reglas, facturación electrónica obligatoria y una carga impositiva que hay que contemplar desde el día uno. **WooCommerce** es la plataforma de ecommerce más usada del mundo y, con los plugins y la configuración correcta, se adapta perfectamente al mercado argentino.

En esta guía cubrimos absolutamente todo lo que necesitas para montar, configurar y escalar una tienda con WooCommerce en Argentina: desde elegir hosting hasta automatizar envíos y facturación.

Contenido

1. [Por qué WooCommerce y no Tiendanube, Shopify u otra plataforma](#por-que-woocommerce)
2. [Hosting y dominio: dónde alojar tu tienda](#hosting)
3. [Configuración básica de WooCommerce para Argentina](#configuración-básica)
4. [Medios de pago: cómo cobrar en Argentina](#medios-de-pago)
5. [Envíos y logística: cómo enviar tus productos](#envíos)
6. [Facturación electrónica y AFIP](#facturación)
7. [Impuestos: IVA, IIBB y percepciones](#impuestos)
8. [Plugins esenciales para WooCommerce en Argentina](#plugins-esenciales)
9. [SEO y marketing para tu tienda](#seo-marketing)
10. [Seguridad y rendimiento](#seguridad)
11. [Checklist de lanzamiento](#checklist)
12. [Cuánto cuesta armar una tienda con WooCommerce en Argentina](#costos)

## Por qué WooCommerce y no Tiendanube, Shopify u otra plataforma

Antes de meternos en la configuración, vale la pena entender por qué WooCommerce es una opción tan fuerte para vender online en Argentina.

| Criterio | WooCommerce | Tiendanube | Shopify |
| --- | --- | --- | --- |
| Costo mensual | **Solo hosting (~$5-15 USD)** | Desde $49 USD/mes | Desde $39 USD/mes |
| Comisión por venta | **0%** | 0.5% - 2% | 0.5% - 2% |
| Personalización | **Ilimitada** | Limitada | Media |
| Plugins / extensiones | **60.000+** | ~200 | ~8.000 |
| Propiedad de los datos | **100% tuya** | En su nube | En su nube |
| SEO avanzado | **Total control** | Básico | Bueno |
| Curva de aprendizaje | Media-alta | **Baja** | Baja-media |
| Soporte local (AR) | Comunidad + devs | **Soporte en español** | En inglés |

**WooCommerce conviene cuando:**

- Querés control total sobre tu tienda y tus datos.
- No querés pagar comisión por cada venta (con Tiendanube, el 2% se acumula rápido).
- Necesitas personalizaciones que en plataformas cerradas no se pueden hacer.
- Ya tenés un sitio en WordPress y querés agregarle ecommerce.
- Estás pensando a largo plazo y querés escalar sin límites artificiales.

## Hosting y dominio: dónde alojar tu tienda

WooCommerce necesita un servidor con WordPress. La elección de hosting impacta directamente en la velocidad de tu tienda, la experiencia del usuario y tu posicionamiento en Google.

### Requisitos mínimos

- PHP 8.0 o superior (idealmente 8.2+)
- MySQL 8.0+ o MariaDB 10.4+
- Certificado SSL (HTTPS obligatorio para cobrar online)
- Al menos 256 MB de memoria PHP
- Almacenamiento SSD

### Opciones de hosting recomendadas

| Tipo | Ejemplos | Precio aprox. | Ideal para |
| --- | --- | --- | --- |
| **Shared hosting** | Bluehost, Hostinger, DonWeb | $3-10 USD/mes | Empezar |
| **WordPress managed** | Cloudways, SiteGround, Kinsta | $10-35 USD/mes | Tiendas en crecimiento |
| **VPS / Cloud** | DigitalOcean, Vultr, Hetzner | $5-20 USD/mes | Devs con experiencia |

### Dominio

Un dominio **.com.ar** genera confianza local y ayuda al SEO regional. Se registra en NIC Argentina y cuesta aproximadamente $6.000 ARS por dos años. También podés usar un **.com** si tu marca apunta a toda Latinoamérica.

## Configuración básica de WooCommerce para Argentina

Una vez que tenés WordPress y WooCommerce instalados, hay configuraciones específicas que necesitas ajustar para el mercado argentino.

### Ubicación y moneda

En **WooCommerce > Ajustes > General**:

- **Dirección de la tienda:** Tu dirección fiscal real en Argentina.
- **Ubicación de venta:** "Vender a países específicos" → Argentina (a menos que vendas al exterior).
- **Moneda:** Peso argentino (ARS).
- **Separador de miles:** punto (.) — ejemplo: $49.990
- **Separador decimal:** coma (,) — ejemplo: $49.990,00

### Provincias y zonas de envío

WooCommerce incluye las 24 jurisdicciones argentinas (23 provincias + CABA) por defecto. Esto es importante para configurar zonas de envío y calcular impuestos por provincia si lo necesitas.

### Checkout y campos argentinos

El checkout estándar de WooCommerce no incluye campos como **DNI/CUIT**, que son necesarios para facturar y para muchos operadores logísticos. Podés agregar estos campos con un plugin de checkout personalizado o con código. También conviene ajustar la etiqueta del campo "State" a "Provincia" y "ZIP Code" a "Código Postal".

## Medios de pago: cómo cobrar en Argentina

Este es probablemente el aspecto más crítico de un ecommerce en Argentina. Tu tasa de conversión depende directamente de cuántas opciones de pago ofrezcas y de lo fluido que sea el proceso.

### Mercado Pago

**Mercado Pago es el medio de pago dominante en Argentina.** Según datos del mercado, más del 60% de las transacciones de ecommerce en Argentina pasan por Mercado Pago. Es prácticamente obligatorio tenerlo.

- **Tarjetas de crédito:** Visa, Mastercard, Amex, Naranja, Cabal, etc. Con cuotas sin interés (que vos podés absorber o trasladar).
- **Tarjetas de débito:** Visa Débito, Maestro, Cabal Débito.
- **Dinero en cuenta:** Saldo de Mercado Pago (muy usado).
- **Transferencia bancaria / QR.**
- **Efectivo:** Rapipago, Pago Fácil.

**Comisión:** Mercado Pago cobra entre el 4% y el 8% por transacción, dependiendo de si ofreces cuotas y el plazo de acreditación que elijas. La acreditación puede ser inmediata (mayor comisión) o en 14 días (menor comisión).

| Plazo acreditación | Comisión aprox. | Cuándo conviene |
| --- | --- | --- |
| Inmediata | ~7-8% | Necesitas el dinero rápido para comprar stock |
| En 14 días | ~4-5% | Tenés capital de trabajo y querés maximizar margen |

Para integrarlo con WooCommerce, usas el **plugin oficial de Mercado Pago para WooCommerce** que se instala desde el repositorio de WordPress.

### Modo Transparente vs Redirect

- **Checkout Pro (redirect):** El cliente es redirigido a Mercado Pago para pagar y vuelve a tu tienda. Más seguro, soporta todos los medios de pago, pero el salto puede generar abandono.
- **Checkout API (transparente):** El formulario de pago se muestra dentro de tu tienda, sin salir. Menor abandono, pero requiere configuración más cuidadosa y no soporta todos los métodos.

### Otras pasarelas de pago

| Pasarela | Comisión aprox. | Ventaja principal | Desventaja |
| --- | --- | --- | --- |
| **Mercado Pago** | 4-8% | Máximo alcance, cuotas | Comisión alta en cuotas |
| **Mobbex** | 2-4% | Menor comisión, checkout transparente | Menor reconocimiento de marca |
| **Decidir (Prisma)** | Variable | Procesador directo, menores fees | Requiere acuerdo, setup complejo |
| **Transferencia bancaria** | 0% | Sin comisión | Manual, lento, propenso a errores |

## Envíos y logística: cómo enviar tus productos

Después de los medios de pago, **los envíos son el segundo factor que más impacta en la conversión** de una tienda online en Argentina. Un costo de envío alto o no mostrar opciones de envío en el checkout son las principales razones de abandono de carrito.

### Operadores logísticos en Argentina

| Operador | Sucursales | Accesibilidad | Integración WooCommerce |
| --- | --- | --- | --- |
| **Correo Argentino** | **5.000+** | **Sin acuerdo (MiCorreo)** | **Completa (CA Pro)** |
| OCA | ~1.500 | Requiere acuerdo | Básica |
| Andreani | ~500 | Requiere acuerdo | Básica |
| Mercado Envíos (Flex) | AMBA | Solo si vendes en ML | No disponible |

### Correo Argentino + WooCommerce: la solución más completa

Para la gran mayoría de las tiendas online en Argentina, **Correo Argentino es el mejor operador logístico**. Tiene la mayor cobertura nacional, tarifas accesibles sin necesidad de negociar un acuerdo comercial, y la mejor integración con WooCommerce gracias a [Correo Argentino Pro](https://correoargentinopro.com/).

Con **[Correo Argentino Pro](https://correoargentinopro.com/)** instalado en tu WooCommerce, obtenés:

Cotización en tiempo real

Tus clientes ven el costo exacto del envío en el checkout, calculado al instante vía API de MiCorreo.

Mapa de sucursales

Modal interactivo con búsqueda, geolocalización y +3.000 sucursales. El comprador elige dónde retirar.

Creación de envíos

Crea envíos en Correo Argentino desde WooCommerce. Soporta MiCorreo (PyMEs) y Paq.Ar (empresas).

Etiquetas PDF

Genera e imprime rotulos de envío directo desde cada pedido. Disponible para clientes Paq.Ar.

Tracking automático

Seguimiento en tiempo real con timeline visual y emails automáticos al cambiar de estado.

Acciones masivas

Crea envíos y genera etiquetas para múltiples pedidos a la vez. Exporta a CSV.
