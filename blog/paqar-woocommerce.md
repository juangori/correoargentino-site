> Fuente: https://correoargentinopro.com/blog/paqar-woocommerce.html

# Paq.Ar y WooCommerce: Cómo Integrar el Servicio de Correo Argentino en tu Tienda

Si tu tienda online ya superó la etapa inicial y estás moviendo un volumen importante de paquetes, probablemente necesites algo más robusto que MiCorreo. Ahí es donde entra **Paq.Ar**, el servicio corporativo de envíos de Correo Argentino. En esta guía te contamos qué es **Paq.Ar**, cómo funciona la integración de **Paq.Ar con WooCommerce**, y por qué puede ser la mejor opción para escalar tus envíos.

## Qué es Paq.Ar

Paq.Ar es la plataforma de envíos corporativos de Correo Argentino, diseñada para empresas y tiendas online que manejan un volumen medio o alto de despachos. A diferencia de MiCorreo (que está orientado a emprendedores y PyMEs que recién arrancan), Paq.Ar te da acceso a herramientas avanzadas pensadas para operaciones logísticas más exigentes.

Entre las características principales de Paq.Ar se encuentran:

- **Tarifas preferenciales:** Negocias las tarifas directamente con Correo Argentino según tu volumen de envíos. Cuanto más enviás, mejores precios conseguís.
- **API de integración:** Paq.Ar ofrece una API que permite crear envíos, generar etiquetas y consultar estados de tracking de forma programática.
- **Generación de etiquetas PDF:** Cada envío genera automáticamente una etiqueta lista para imprimir, sin necesidad de completar formularios manuales.
- **Recolección en depósito:** Dependiendo del acuerdo, Correo Argentino puede pasar a retirar los paquetes por tu depósito o centro de distribución.
- **Tracking detallado:** Acceso a estados de seguimiento más granulares que los disponibles en MiCorreo.

## Requisitos para usar Paq.Ar

Antes de integrar **Paq.Ar con WooCommerce**, necesitas cumplir algunos requisitos previos:

1. **Acuerdo comercial con Correo Argentino:** Tenés que contactar al área comercial de Correo Argentino y firmar un convenio. Este proceso incluye definir volúmenes estimados, tipos de servicio (domicilio, sucursal) y tarifas.
2. **Credenciales de API:** Una vez firmado el acuerdo, Correo Argentino te proporciona las credenciales necesarias para conectarte a la API de Paq.Ar: usuario, contraseña y código de cliente.
3. **CUIT activo:** Tu empresa debe tener CUIT registrado y estar habilitada para facturar.
4. **Volumen mínimo:** Si bien no hay un número oficial publicado, Paq.Ar está pensado para operaciones con al menos varias decenas de envíos mensuales. Si haces menos de 20 envíos por mes, MiCorreo probablemente sea suficiente.

Si todavía estás en una etapa temprana y no tenés acuerdo comercial, te recomendamos leer nuestra [guía completa de envíos ecommerce con Correo Argentino](https://correoargentinopro.com/blog/envios-correo-argentino-tienda-online.html), donde explicamos las diferencias entre MiCorreo y Paq.Ar en detalle.

## Cómo funciona Paq.Ar con WooCommerce

La integración de **Paq.Ar con WooCommerce** se realiza a través del plugin [Correo Argentino Pro](https://correoargentinopro.com/). Este plugin conecta tu tienda WooCommerce directamente con la API de Paq.Ar, automatizando todo el flujo de envíos sin que tengas que salir de tu panel de WordPress.

### Funcionalidades clave de la integración

- **Creación de envíos vía API:** Cuando un cliente hace una compra, podés crear el envío en Paq.Ar directamente desde el pedido de WooCommerce. El plugin envía los datos del destinatario, las dimensiones del paquete y el tipo de servicio a la API de Correo Argentino.
- **Generación automática de etiquetas:** Cada envío creado genera una etiqueta en formato PDF que podés descargar e imprimir directamente. No necesitas entrar a ninguna plataforma externa.
- **Envíos masivos:** Si tenés muchos pedidos pendientes, podés seleccionarlos y crear todos los envíos de una sola vez con la función de acciones masivas. Lo mismo aplica para la generación de etiquetas en lote.
- **Tracking automático:** El número de seguimiento se asigna automáticamente al pedido. Tus clientes reciben notificaciones por email cuándo el estado del envío cambia, sin que vos tengas qué hacer nada.
- **Selector de sucursales:** Si ofreces retiro en sucursal, tus clientes pueden elegir la sucursal de Correo Argentino más cercana directamente en el checkout, con un mapa interactivo.

## Paso a paso: integrar Paq.Ar con WooCommerce

Si ya tenés tu acuerdo comercial y tus credenciales, estos son los pasos para poner todo en marcha:

### 1. Instalar el plugin Correo Argentino Pro

Descarga el plugin desde [correoargentinopro.com](https://correoargentinopro.com/) y subilo a tu WordPress desde *Plugins > Agregar nuevo > Subir plugin*. Activa la licencia con la clave que recibiste por email.

### 2. Configurar las credenciales de Paq.Ar

Anda a *WooCommerce > Ajustes > Correo Argentino Pro* y selecciona Paq.Ar como servicio. Ingresa tu usuario, contraseña y código de cliente que te proporcionó Correo Argentino. El plugin va a validar la conexión automáticamente.

### 3. Configurar las zonas de envío

En *WooCommerce > Ajustes > Envíos*, crea una zona de envío para Argentina y agrega el método de envío "Correo Argentino Pro". Desde ahí podés configurar:

- Tipos de servicio habilitados (envío a domicilio, envío a sucursal).
- Dimensiones y peso por defecto para productos sin datos cargados.
- Monto mínimo para envío gratuito (si querés ofrecerlo).
- Margen o ajuste sobre la tarifa (por ejemplo, un descuento que quieras trasladar al cliente).

### 4. Probar el flujo completo

Hace un pedido de prueba en tu tienda, crea el envío desde el panel del pedido, genera la etiqueta y verifica que el tracking se asigne correctamente. Te recomendamos probar tanto envío a domicilio como retiro en sucursal.

Si necesitas una guía más detallada sobre la instalación general del plugin, consulta nuestro artículo sobre [cómo integrar Correo Argentino con WooCommerce](https://correoargentinopro.com/blog/como-integrar-correo-argentino-woocommerce.html).

## Paq.Ar vs MiCorreo: cuál te conviene para WooCommerce

La elección entre Paq.Ar y MiCorreo depende del volumen y la madurez de tu operación. Acá te dejamos una comparación práctica:

| Aspecto | MiCorreo | Paq.Ar |
|---|---|---|
| Registro | Libre, sin acuerdo | Requiere convenio comercial |
| Tarifas | Públicas, fijas | Negociadas según volumen |
| Cotización en checkout | Sí, vía API en tiempo real | Sí, con tarifas precargadas |
| Etiquetas PDF | No disponible | Sí, automáticas vía API |
| Envíos masivos | Limitado | Completo, con acciones en lote |
| Recolección | No | Según acuerdo |
| Ideal para | Hasta ~50 envíos/mes | Más de 50 envíos/mes |

Si tu tienda WooCommerce está creciendo y las limitaciones de MiCorreo empiezan a frenarte (falta de etiquetas, proceso manual repetitivo, tarifas sin descuento), **Paq.Ar es el paso natural**. La integración con Correo Argentino Pro te permite aprovechar todas las ventajas de Paq.Ar sin cambiar tu flujo de trabajo.

## Ventajas concretas de usar Paq.Ar con WooCommerce

- **Ahorro de tiempo:** La generación automática de etiquetas y la creación de envíos masivos te puede ahorrar horas de trabajo manual por semana.
- **Menos errores:** Al automatizar el envío de datos a la API, eliminas errores de tipeo en direcciones, códigos postales o nombres de destinatarios.
- **Mejor experiencia del cliente:** Tracking automático, notificaciones por email y la posibilidad de elegir sucursal en un mapa hacen que tus compradores tengan una experiencia de envío profesional.
- **Costos más bajos:** Las tarifas negociadas de Paq.Ar son significativamente menores que las tarifas públicas de MiCorreo, especialmente en envíos de larga distancia.
- **Escalabilidad:** Podés pasar de 50 a 500 envíos mensuales sin cambiar de herramienta ni de proceso.

## Próximos pasos

Si ya tenés tu acuerdo comercial con Correo Argentino, podés empezar hoy mismo. [Descarga Correo Argentino Pro](https://correoargentinopro.com/), configura tus credenciales de Paq.Ar y automatiza tus envíos desde WooCommerce.

Si todavía no tenés acuerdo comercial, contacta al área comercial de Correo Argentino para iniciar el trámite. Mientras tanto, podés usar MiCorreo con el mismo plugin y migrar a Paq.Ar cuándo estés listo.

Revisa nuestras [preguntas frecuentes](https://correoargentinopro.com/faqs.html) si tenés dudas sobre la configuración, o [contactanos](https://correoargentinopro.com/contacto.html) para que te ayudemos con la integración.

## También te puede interesar

- [Todo sobre la etiqueta de envío de Correo Argentino](https://correoargentinopro.com/blog/etiqueta-envio-correo-argentino.html)
- [Cómo imprimir etiquetas masivas en WooCommerce](https://correoargentinopro.com/blog/imprimir-etiquetas-masivas-woocommerce.html)
- [Plugin oficial de Correo Argentino vs Correo Argentino Pro](https://correoargentinopro.com/blog/correo-argentino-plugin-oficial-vs-pro.html)
