> Fuente: https://correoargentinopro.com/blog/conectar-woocommerce-afip-factura-electronica.html

# Cómo Conectar WooCommerce con AFIP: Facturación Electrónica Automática

> Guía para conectar WooCommerce con AFIP y automatizar la facturación electrónica. Plugins, configuración del webservice, y errores comunes a evitar.

Si vendes online en Argentina, emitir **facturas electrónicas** a través de AFIP no es opcional: es una obligación fiscal. Ya seas monotributista o responsable inscripto, cada venta que realices en tu tienda WooCommerce debe estar respaldada por un comprobante fiscal válido. La buena noticia es que existen herramientas que te permiten automatizar este proceso y conectar tu WooCommerce directamente con el webservice de facturación de AFIP.

## Es obligatorio facturar cada venta online?

Sí, **AFIP exige que cada operación de venta sea facturada**, sin importar el monto ni el canal de venta. Esto aplica tanto para monotributistas como para responsables inscriptos. Las ventas realizadas a través de una tienda online no son la excepción.

Las consecuencias de no facturar pueden ser severas:

- **Multas:** AFIP puede aplicar sanciones económicas por facturación irregular o faltante.
- **Clausura temporal:** en casos graves, puede ordenar la clausura del establecimiento o la baja del sitio web.
- **Problemas con la categoría de monotributo:** si tus ingresos no coinciden con lo facturado, podrías ser recategorizado o excluido del régimen.
- **Imposibilidad de deducir gastos:** sin facturación correcta, no podés justificar ingresos ni deducir costos asociados, como los de envío. Te recomendamos leer nuestra guía sobre [costos de envío y deducción de impuestos](https://correoargentinopro.com/blog/costos-envio-deduccion-impuestos-argentina.html) para entender este punto.

## Qué necesitas para empezar

Antes de conectar tu WooCommerce con AFIP, necesitas tener en orden algunos requisitos previos:

1. **CUIT activo:** tu Clave Única de Identificación Tributaria debe estar habilitada y sin irregularidades.
2. **Clave fiscal nivel 3 o superior:** necesitas acceso al portal de AFIP con clave fiscal de nivel 3 como mínimo para administrar los webservices.
3. **Certificado digital para webservice:** AFIP requiere un certificado digital que autoriza a tu aplicación (el plugin de WooCommerce) a emitir facturas en tu nombre.
4. **Punto de venta electrónico autorizado:** debes dar de alta un punto de venta específico para la facturación electrónica desde el portal de AFIP, en la sección "Administración de puntos de venta y domicilios".

Estos pasos se realizan directamente en el sitio web de AFIP (**afip.gob.ar**) y son un requisito previo indispensable antes de configurar cualquier plugin.

## Plugins de WooCommerce para facturación AFIP

Existen varios plugins que permiten conectar WooCommerce con el webservice de facturación electrónica de AFIP (**WSFEV1**). Al evaluar opciones, busca las siguientes funcionalidades clave:

- **Generación automática de facturas:** el plugin debería emitir la factura automáticamente cuando el pedido cambia a estado "completado" o "procesando".
- **Descarga de PDF:** tanto el administrador como el cliente deberían poder descargar la factura en formato PDF.
- **Envío por email:** la factura debería adjuntarse automáticamente al email de confirmación del pedido.
- **Soporte para notas de crédito:** si necesitas hacer una devolución, el plugin debe permitir emitir notas de crédito asociadas a la factura original.
- **Compatibilidad con tipos de comprobante:** Factura A, B y C según corresponda.

Algunos plugins son gratuitos y cubren lo básico, mientras que las versiones premium ofrecen automatización completa, soporte prioritario y funcionalidades avanzadas como facturación masiva.

## Cómo configurar el webservice de AFIP

La configuración del webservice es el paso más técnico del proceso. A continuación te explicamos cómo hacerlo:

1. **Accede a AFIP con clave fiscal:** ingresa a afip.gob.ar con tu CUIT y clave fiscal.
2. **Busca "Administrador de Relaciones de Clave Fiscal":** desde el menú de servicios, accede al administrador de relaciones.
3. **Autoriza el webservice:** busca "Webservice de Facturación Electrónica" (WSFE) y autoriza el acceso para tu CUIT.
4. **Genera el certificado digital:** desde la sección de "Certificados Digitales", genera un nuevo certificado. El plugin te proporcionará un archivo CSR (Certificate Signing Request) que debes subir a AFIP para obtener el certificado firmado.
5. **Descarga e instala el certificado:** AFIP te devuelve un archivo.crt que debes subir al plugin en tu WooCommerce.
6. **Configura el punto de venta:** en el plugin, indica el número de punto de venta que diste de alta previamente.
7. **Testa en homologación:** antes de operar en producción, usa el entorno de homologación (testing) de AFIP para verificar que todo funcione correctamente. Este paso es crucial para evitar errores en facturas reales.

## Monotributo vs Responsable Inscripto

El tipo de factura que emite tu tienda depende de tu condición fiscal:

### Monotributo

- Emite únicamente **Factura C**.
- No discrimina IVA (el IVA está incluido en el precio final).
- Emite Factura C tanto a consumidores finales como a responsables inscriptos.
- Es la opción más simple desde el punto de vista de configuración del plugin.

### Responsable Inscripto

- Emite **Factura A** a otros responsables inscriptos (discriminando IVA).
- Emite **Factura B** a consumidores finales y monotributistas.
- El plugin debe detectar automáticamente el tipo de comprobante según el CUIT o DNI del comprador.
- Es importante configurar correctamente la alícuota de IVA (generalmente 21%) en los productos.

Un buen plugin de facturación pedirá al comprador su condición fiscal (Consumidor Final, Responsable Inscripto, Monotributo, Exento) y su CUIT o DNI en el checkout, y emitirá el comprobante correspondiente automáticamente.

## Cómo facturar el envío

Un punto que genera dudas frecuentes es **cómo incluir el costo de envío en la factura**. Hay dos enfoques principales:

- **Como ítem separado:** el envío aparece como una línea adicional en la factura, con su propia descripción e IVA (si corresponde).
- **Incluido en el total:** el costo de envío se suma al total sin discriminar como ítem separado.

Para responsables inscriptos, el envío está gravado con IVA al 21%, por lo que es importante que el plugin lo contemple correctamente. Te recomendamos leer nuestra guía completa sobre [cómo facturar envíos en ecommerce en Argentina](https://correoargentinopro.com/blog/como-facturar-envios-ecommerce-argentina.html) donde explicamos este tema en detalle.

## Errores comunes

Estos son los errores más frecuentes al conectar WooCommerce con AFIP, y cómo evitarlos:

- **Punto de venta incorrecto:** el número de punto de venta configurado en el plugin debe coincidir exactamente con el que diste de alta en AFIP. Un número diferente genera rechazo.
- **Certificado vencido:** los certificados digitales de AFIP tienen fecha de expiración. Si tu plugin deja de emitir facturas de un día para el otro, verifica la vigencia del certificado.
- **Errores de CAE:** el CAE (Código de Autorización Electrónico) es el número que AFIP asigna a cada factura. Si el webservice devuelve errores de CAE, generalmente se debe a datos incorrectos en la solicitud.
- **Saltos en la numeración:** AFIP exige que la numeración de facturas sea consecutiva. Si hay saltos (por ejemplo, de la factura 10 a la 12), puede generar alertas y problemas fiscales.
- **No testar en homologación:** pasar directamente a producción sin probar en el entorno de testing es la causa más común de problemas. Siempre testa primero.
- **Condición fiscal incorrecta:** emitir Factura A a un consumidor final o Factura B a un responsable inscripto genera comprobantes inválidos.

## Preguntas frecuentes

### ¿Cómo conecto WooCommerce con AFIP para facturar?

Con un plugin que se conecte al **webservice de facturación electrónica de AFIP (WSFEV1)**. El proceso es: entrar a afip.gob.ar con CUIT y clave fiscal, autorizar el Webservice de Facturación Electrónica (WSFE) desde el Administrador de Relaciones de Clave Fiscal, generar el certificado digital subiendo el archivo CSR que te da el plugin, cargar en WooCommerce el.crt que devuelve AFIP e indicar el número de punto de venta. Antes de operar en producción, testeá siempre en el entorno de homologación.

### ¿Qué necesito antes de configurar la facturación electrónica?

Cuatro requisitos previos, todos gestionados en el sitio de AFIP: **CUIT activo** y sin irregularidades, **clave fiscal de nivel 3 o superior**, un **certificado digital** que autorice a tu aplicación a emitir facturas en tu nombre y un **punto de venta electrónico** dado de alta en la sección "Administración de puntos de venta y domicilios". Sin esto no vas a poder configurar ningún plugin.

### ¿Qué tipo de factura emite mi tienda: A, B o C?

Depende de tu condición fiscal. Si sos **monotributista** emitís únicamente Factura C, sin discriminar IVA, tanto a consumidores finales como a responsables inscriptos. Si sos **responsable inscripto**, emitís Factura A a otros responsables inscriptos (discriminando IVA) y Factura B a consumidores finales y monotributistas; el plugin debería detectar automáticamente el tipo de comprobante según el CUIT o DNI del comprador.

### ¿Cómo se incluye el costo de envío en la factura?

Hay dos enfoques: como **ítem separado**, con su propia descripción e IVA si corresponde, o **incluido en el total** sin discriminarlo. Para responsables inscriptos el envío está gravado con IVA al 21%, así que es clave que el plugin lo contemple correctamente. Lo explicamos en detalle en nuestra guía sobre [cómo facturar envíos en ecommerce en Argentina](https://correoargentinopro.com/blog/como-facturar-envios-ecommerce-argentina.html).

## Automatizar todo: pagos + envíos + facturación

El escenario ideal para una tienda WooCommerce en Argentina es tener los tres pilares automatizados:

1. **Pagos:** un plugin de medios de pago como Mercado Pago o Mobbex que procese el cobro automáticamente.
2. **Envíos:** un plugin como [Correo Argentino Pro](https://correoargentinopro.com/) que cotice el envío en tiempo real, permita la creación automática de envíos y genere etiquetas PDF con un click.
3. **Facturación:** un plugin de facturación AFIP que emita el comprobante automáticamente al completarse el pedido.

Con estos tres componentes funcionando en conjunto, el flujo es completamente automático: el cliente elige sus productos, ve el costo de envío en tiempo real, paga con su método preferido, recibe la factura por email y el envío se genera automáticamente. Vos solo tenés que preparar el paquete y entregarlo al correo.

Si querés profundizar en cómo configurar el envío, nuestra [guía de integración de Correo Argentino con WooCommerce](https://correoargentinopro.com/blog/como-integrar-correo-argentino-woocommerce.html) te explica todo el proceso paso a paso. Y para una visión general de cómo armar tu tienda completa, visita nuestra [guía completa de WooCommerce en Argentina](https://correoargentinopro.com/blog/woocommerce-argentina-guia-completa.html).

Si tenés dudas sobre la configuración o necesitas ayuda, consulta nuestras [preguntas frecuentes](https://correoargentinopro.com/faqs.html) o [escribinos](https://correoargentinopro.com/contacto.html) y te orientamos.
