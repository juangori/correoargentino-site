> Fuente: https://correoargentinopro.com/blog/como-integrar-correo-argentino-woocommerce.html

# Cómo integrar Correo Argentino con WooCommerce (5 pasos)

Si tenés una [tienda online con WooCommerce](https://correoargentinopro.com/blog/envios-correo-argentino-tienda-online.html) y querés ofrecer envíos a través de **Correo Argentino**, necesitas una forma de conectar ambos sistemas. En esta guía te mostramos cómo hacerlo de forma profesional, con cotización en tiempo real, creación de envíos automatizada, etiquetas PDF y tracking.

## Por qué integrar Correo Argentino con tu tienda WooCommerce?

Correo Argentino es la empresa de logística con mayor cobertura en Argentina. Con más de 3.000 sucursales en todo el país, ofrece opciones tanto para envío a domicilio como para retiro en sucursal. Integrar Correo Argentino con tu WooCommerce te permite:

- **Cotizar envíos en tiempo real** para que tus clientes vean el costo exacto en el checkout.
- **Ofrecer retiro en sucursal** con un selector de sucursales interactivo con mapa.
- **Crear envíos automáticamente** desde el panel de WooCommerce, sin entrar al sistema de Correo Argentino.
- **Generar etiquetas PDF** listas para imprimir y pegar en el paquete.
- **Hacer tracking automático** con notificaciones por email a tus clientes.

## Opciones disponibles: MiCorreo vs Paq.Ar

Correo Argentino ofrece dos servicios principales para e-commerce. Si querés entender a fondo las diferencias, te recomendamos nuestro artículo sobre [qué es MiCorreo](https://correoargentinopro.com/blog/que-es-micorreo-correo-argentino.html) y nuestra guía de [Paq.Ar y WooCommerce](https://correoargentinopro.com/blog/paqar-woocommerce.html).

### MiCorreo

**MiCorreo** es el servicio pensado para PyMEs, emprendedores y monotributistas. Sus principales ventajas:

- No requiere acuerdo comercial previo.
- Permite cotizar envíos por API (el plugin muestra el precio en el checkout).
- Soporta envío a domicilio y retiro en sucursal.
- Podés crear envíos y generar la documentación necesaria.

Es ideal si recién empezás o si tenés un volumen de envíos bajo a medio.

### Paq.Ar v2

**Paq.Ar** es el servicio para empresas con acuerdo comercial con Correo Argentino. Incluye:

- Tarifas preferenciales según el acuerdo.
- Generación de etiquetas PDF oficiales.
- Creación de envíos vía API.
- Tracking avanzado.

Si ya tenés un acuerdo con Correo Argentino o manejas alto volumen, Paq.Ar es la mejor opción.

## Paso a paso: configurar Correo Argentino en WooCommerce

### 1. Instalar el plugin

Instala [Correo Argentino Pro](https://correoargentinopro.com/) desde el panel de WordPress: **Plugins > Agregar nuevo > Subir plugin**. Subí el archivo .zip, activa el plugin e ingresa tu clave de licencia en **Correo Arg. Pro > Configuración > Licencia**.

### 2. Configurar las credenciales de la API

El plugin incluye un **wizard de configuración** que te guía paso a paso. Necesitas:

- **Para MiCorreo:** tu email y contraseña de la cuenta MiCorreo.
- **Para Paq.Ar:** tu usuario, contraseña y código de cliente del acuerdo comercial.

El wizard prueba la conexión automáticamente para asegurarte de que todo funcione.

### 3. Configurar las opciones de envío

En **WooCommerce > Ajustes > Envío**, agrega el método de envío "Correo Argentino Pro" a las zonas de envío donde quieras ofrecer Correo Argentino. Podés configurar:

- Servicios habilitados (domicilio, sucursal, clásico, expreso).
- Recargo o descuento sobre la tarifa.
- Envío gratis a partir de cierto monto.
- Dimensiones y peso por defecto.

### 4. Probar el checkout

Agrega un producto al carrito y hace una compra de prueba. Deberías ver las opciones de envío de Correo Argentino con el precio cotizado en tiempo real. Si seleccionas retiro en sucursal, se abre el mapa con las sucursales más cercanas.

### 5. Gestionar envíos

Desde cada pedido en WooCommerce, podés crear el envío en Correo Argentino con un solo click. El tracking se asigna automáticamente y tus clientes reciben notificaciones por email cuándo el estado del envío cambia.

## Requisitos

- WordPress 5.8 o superior.
- WooCommerce 6.0 o superior.
- PHP 7.4 o superior.
- Cuenta en MiCorreo o acuerdo Paq.Ar con Correo Argentino.
- Licencia activa de [Correo Argentino Pro](https://correoargentinopro.com/).

## Preguntas frecuentes

### ¿Se puede integrar Correo Argentino con WooCommerce?

Sí. Correo Argentino ofrece las API de MiCorreo y Paq.Ar, que permiten conectar tu tienda WooCommerce para cotizar envíos, ofrecer retiro en sucursal, crear los envíos y hacer tracking sin salir de WordPress.

### ¿Necesito un plugin?

Sí. WooCommerce no trae Correo Argentino de fábrica, así que necesitás un plugin que consuma las API de MiCorreo o Paq.Ar. [Correo Argentino Pro](https://correoargentinopro.com/) incluye un wizard que carga las credenciales y prueba la conexión automáticamente, sin tocar código.

### ¿Cotiza en el checkout?

Sí. Una vez integrado, el precio del envío se calcula en tiempo real durante el checkout según el código postal, el peso y las dimensiones del pedido, tanto para envío a domicilio como para retiro en sucursal. Podés estimarlo antes con nuestro [cotizador online](https://correoargentinopro.com/blog/cotizar-envio-correo-argentino.html).

### ¿Es gratis?

Crear una cuenta en MiCorreo es gratis y Correo Argentino Pro tiene una [prueba gratis de 15 días](https://correoargentinopro.com/). El costo de cada envío depende del destino, el peso y el servicio elegido, no del plugin.

Tenés más dudas? Revisa nuestra [sección de preguntas frecuentes](https://correoargentinopro.com/faqs.html) o consulta la [documentación completa](https://correoargentinopro.com/ayuda.html). También podés [contactarnos](https://correoargentinopro.com/contacto.html) directamente.

## También te puede interesar

- [Envíos ecommerce con Correo Argentino: guía completa](https://correoargentinopro.com/blog/envios-correo-argentino-tienda-online.html)
- [Cotizar envíos con Correo Argentino online](https://correoargentinopro.com/blog/cotizar-envio-correo-argentino.html)
- [Todo sobre la etiqueta de envío de Correo Argentino](https://correoargentinopro.com/blog/etiqueta-envio-correo-argentino.html)
- [WooCommerce en Argentina: guía completa](https://correoargentinopro.com/blog/woocommerce-argentina-guia-completa.html)
