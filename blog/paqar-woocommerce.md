> Fuente: https://correoargentinopro.com/blog/paqar-woocommerce.html

# Paq.Ar y WooCommerce: Cómo Integrar el Servicio de Correo Argentino en tu Tienda

Si tu tienda online ya supero la etapa inicial y estas moviendo un volumen importante de paquetes, probablemente necesites algo mas robusto que MiCorreo. Ahi es donde entra **Paq.Ar**, el servicio corporativo de envíos de Correo Argentino. En esta guía te contamos qué es **Paq.Ar**, como funciona la integración de **Paq.Ar con WooCommerce**, y por que puede ser la mejor opción para escalar tus envíos.

## Qué es Paq.Ar

Paq.Ar es la plataforma de envíos corporativos de Correo Argentino, disenada para empresas y tiendas online que manejan un volumen medio o alto de despachos. A diferencia de MiCorreo (que esta orientado a emprendedores y PyMEs que recien arrancan), Paq.Ar te da acceso a herramientas avanzadas pensadas para operaciones logísticas mas exigentes.

Entre las caracteristicas principales de Paq.Ar se encuentran:

- **Tarifas preferenciales:** Negocias las tarifas directamente con Correo Argentino según tu volumen de envíos. Cuanto mas envias, mejores precios conseguis.
- **API de integración:** Paq.Ar ofrece una API que permite crear envíos, generar etiquetas y consultar estados de tracking de forma programatica.
- **Generación de etiquetas PDF:** Cada envío genera automáticamente una etiqueta lista para imprimir, sin necesidad de completar formularios manuales.
- **Recoleccion en deposito:** Dependiendo del acuerdo, Correo Argentino puede pasar a retirar los paquetes por tu deposito o centro de distribucion.
- **Tracking detallado:** Acceso a estados de seguimiento mas granulares que los disponibles en MiCorreo.

## Requisitos para usar Paq.Ar

Antes de integrar **Paq.Ar con WooCommerce**, necesitas cumplir algunos requisitos previos:

1. **Acuerdo comercial con Correo Argentino:** Tenes que contactar al area comercial de Correo Argentino y firmar un convenio. Este proceso incluye definir volumenes estimados, tipos de servicio (domicilio, sucursal) y tarifas.
2. **Credenciales de API:** Una vez firmado el acuerdo, Correo Argentino te proporciona las credenciales necesarias para conectarte a la API de Paq.Ar: usuario, contrasena y codigo de cliente.
3. **CUIT activo:** Tu empresa debe tener CUIT registrado y estar habilitada para facturar.
4. **Volumen mínimo:** Si bien no hay un numero oficial publicado, Paq.Ar esta pensado para operaciones con al menos varias decenas de envíos mensuales. Si haces menos de 20 envíos por mes, MiCorreo probablemente sea suficiente.

Si todavia estas en una etapa temprana y no tenes acuerdo comercial, te recomendamos leer nuestra [guía completa de envíos ecommerce con Correo Argentino](https://correoargentinopro.com/blog/envios-correo-argentino-tienda-online.html), donde explicamos las diferencias entre MiCorreo y Paq.Ar en detalle.

## Como funciona Paq.Ar con WooCommerce

La integración de **Paq.Ar con WooCommerce** se realiza a traves del plugin [Correo Argentino Pro](https://correoargentinopro.com/). Este plugin conecta tu tienda WooCommerce directamente con la API de Paq.Ar, automatizando todo el flujo de envíos sin que tengas que salir de tu panel de WordPress.

### Funcionalidades clave de la integración

- **Creacion de envíos via API:** Cuando un cliente hace una compra, podes crear el envío en Paq.Ar directamente desde el pedido de WooCommerce. El plugin envia los datos del destinatario, las dimensiones del paquete y el tipo de servicio a la API de Correo Argentino.
- **Generación automatica de etiquetas:** Cada envío creado genera una etiqueta en formato PDF que podes descargar e imprimir directamente. No necesitas entrar a ninguna plataforma externa.
- **Envíos masivos:** Si tenes muchos pedidos pendientes, podes seleccionarlos y crear todos los envíos de una sola vez con la funcion de acciones masivas. Lo mismo aplica para la generación de etiquetas en lote.
- **Tracking automático:** El numero de seguimiento se asigna automáticamente al pedido. Tus clientes reciben notificaciones por email cuándo el estado del envío cambia, sin que vos tengas qué hacer nada.
- **Selector de sucursales:** Si ofreces retiro en sucursal, tus clientes pueden elegir la sucursal de Correo Argentino mas cercana directamente en el checkout, con un mapa interactivo.

## Paso a paso: integrar Paq.Ar con WooCommerce

Si ya tenes tu acuerdo comercial y tus credenciales, estos son los pasos para poner todo en marcha:

### 1. Instalar el plugin Correo Argentino Pro

Descarga el plugin desde [correoargentinopro.com](https://correoargentinopro.com/) y subilo a tu WordPress desde *Plugins > Agregar nuevo > Subir plugin*. Activa la licencia con la clave que recibiste por email.

### 2. Configurar las credenciales de Paq.Ar

Anda a *WooCommerce > Ajustes > Correo Argentino Pro* y selecciona Paq.Ar como servicio. Ingresa tu usuario, contrasena y codigo de cliente que te proporciono Correo Argentino. El plugin va a validar la conexion automáticamente.

### 3. Configurar las zonas de envío

En *WooCommerce > Ajustes > Envíos*, crea una zona de envío para Argentina y agrega el metodo de envío "Correo Argentino Pro". Desde ahi podes configurar:

- Tipos de servicio habilitados (envío a domicilio, envío a sucursal).
- Dimensiones y peso por defecto para productos sin datos cargados.
- Monto mínimo para envío gratuito (si queres ofrecerlo).
- Margen o ajuste sobre la tarifa (por ejemplo, un descuento que quieras trasladar al cliente).

### 4. Probar el flujo completo

Hace un pedido de prueba en tu tienda, crea el envío desde el panel del pedido, genera la etiqueta y verifica que el tracking se asigne correctamente. Te recomendamos probar tanto envío a domicilio como retiro en sucursal.

Si necesitas una guía mas detallada sobre la instalacion general del plugin, consulta nuestro articulo sobre [como integrar Correo Argentino con WooCommerce](https://correoargentinopro.com/blog/como-integrar-correo-argentino-woocommerce.html).

## Paq.Ar vs MiCorreo: cual te conviene para WooCommerce

La eleccion entre Paq.Ar y MiCorreo depende del volumen y la madurez de tu operacion. Aca te dejamos una comparacion practica:

| Aspecto | MiCorreo | Paq.Ar |
|---|---|---|
| Registro | Libre, sin acuerdo | Requiere convenio comercial |
| Tarifas | Publicas, fijas | Negociadas según volumen |
| Cotización en checkout | Si, via API en tiempo real | Si, con tarifas precargadas |
| Etiquetas PDF | No disponible | Si, automáticas via API |
| Envíos masivos | Limitado | Completo, con acciones en lote |
| Recoleccion | No | Segun acuerdo |
| Ideal para | Hasta ~50 envíos/mes | Mas de 50 envíos/mes |

Si tu tienda WooCommerce esta creciendo y las limitaciones de MiCorreo empiezan a frenarte (falta de etiquetas, proceso manual repetitivo, tarifas sin descuento), **Paq.Ar es el paso natural**. La integración con Correo Argentino Pro te permite aprovechar todas las ventajas de Paq.Ar sin cambiar tu flujo de trabajo.

## Ventajas concretas de usar Paq.Ar con WooCommerce

- **Ahorro de tiempo:** La generación automatica de etiquetas y la creacion de envíos masivos te puede ahorrar horas de trabajo manual por semana.
- **Menos errores:** Al automatizar el envío de datos a la API, eliminas errores de tipeo en direcciones, codigos postales o nombres de destinatarios.
- **Mejor experiencia del cliente:** Tracking automático, notificaciones por email y la posibilidad de elegir sucursal en un mapa hacen que tus compradores tengan una experiencia de envío profesional.
- **Costos mas bajos:** Las tarifas negociadas de Paq.Ar son significativamente menores que las tarifas publicas de MiCorreo, especialmente en envíos de larga distancia.
- **Escalabilidad:** Podes pasar de 50 a 500 envíos mensuales sin cambiar de herramienta ni de proceso.

## Proximos pasos

Si ya tenes tu acuerdo comercial con Correo Argentino, podes empezar hoy mismo. [Descarga Correo Argentino Pro](https://correoargentinopro.com/), configura tus credenciales de Paq.Ar y automatiza tus envíos desde WooCommerce.

Si todavia no tenes acuerdo comercial, contacta al area comercial de Correo Argentino para iniciar el tramite. Mientras tanto, podes usar MiCorreo con el mismo plugin y migrar a Paq.Ar cuándo estes listo.

Revisa nuestras [preguntas frecuentes](https://correoargentinopro.com/faqs.html) si tenes dudas sobre la configuración, o [contactanos](https://correoargentinopro.com/contacto.html) para que te ayudemos con la integración.

## Tambien te puede interesar

- [Todo sobre la etiqueta de envio de Correo Argentino](https://correoargentinopro.com/blog/etiqueta-envio-correo-argentino.html)
- [Como imprimir etiquetas masivas en WooCommerce](https://correoargentinopro.com/blog/imprimir-etiquetas-masivas-woocommerce.html)
- [Plugin oficial de Correo Argentino vs Correo Argentino Pro](https://correoargentinopro.com/blog/correo-argentino-plugin-oficial-vs-pro.html)
