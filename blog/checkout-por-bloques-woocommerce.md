> Fuente: https://correoargentinopro.com/blog/checkout-por-bloques-woocommerce.html

# Checkout por Bloques en WooCommerce: Qué Es y Por Qué Importa (2026)

> Qué es el checkout por bloques de WooCommerce, en qué se diferencia del checkout clásico y por qué tu tienda debería usarlo. Guía para dueños de tiendas.

Si actualizaste WooCommerce recientemente, es probable que hayas notado que la página de checkout de tu tienda se ve diferente. Tal vez los campos están organizados de otra forma, o el diseño se siente más moderno. Eso es el **checkout por bloques**, el nuevo sistema de checkout de WooCommerce que reemplaza al clásico. En esta guía te explicamos qué cambió, por qué y qué significa para tu tienda.

## Qué es el checkout por bloques

Para entender el checkout por bloques, primero hay que saber cómo funcionaba el checkout clásico. Tradicionalmente, WooCommerce usaba un **shortcode** para generar la página de checkout. Un shortcode es básicamente un código corto (`[woocommerce_checkout]`) que le dice a WordPress "acá pone el formulario de checkout". El problema es que ese shortcode generaba una estructura rígida y difícil de personalizar sin conocimientos de programación.

El checkout por bloques usa un enfoque completamente distinto. En lugar de un shortcode, utiliza el **editor de bloques de WordPress** (también conocido como Gutenberg). Esto significa que la página de checkout está compuesta por bloques individuales que podés mover, agregar o quitar desde el editor visual, sin tocar código.

Para vos como dueño de tienda, la diferencia práctica es:

- El checkout **carga más rápido** porque usa tecnología más moderna.
- Es **más fácil de personalizar** usando el editor de bloques de WordPress.
- Tiene un **diseño más limpio y moderno** por defecto.
- Soporta **nuevas funcionalidades** de WooCommerce que el checkout clásico no puede usar.

## Checkout clásico vs checkout por bloques

Veamos las diferencias principales en términos concretos:

### Checkout clásico

- Usa el shortcode `[woocommerce_checkout]`.
- La estructura está definida por templates PHP que vienen con WooCommerce o con tu tema.
- Personalizar requiere editar archivos PHP o usar plugins adicionales.
- Funciona bien, pero es una tecnología de hace 10 años.
- Muchos plugins fueron desarrollados para este checkout, así que la compatibilidad es amplia.

### Checkout por bloques

- Usa bloques del editor de WordPress.
- La estructura se modifica visualmente desde el editor, arrastrando y soltando bloques.
- Personalizar es mucho más accesible: podés cambiar el orden de los campos, agregar texto, imágenes o bloques personalizados sin programar.
- Carga más rápido gracias a que usa React en el frontend.
- Soporta funcionalidades nuevas como el Local Pickup integrado de WooCommerce.

En resumen: el checkout por bloques es la evolución natural del checkout de WooCommerce. No es que el clásico sea malo, pero el de bloques es mejor en casi todos los aspectos.

## Por qué WooCommerce hizo el cambio

WooCommerce decidió migrar al checkout por bloques por varias razones:

- **Rendimiento:** el checkout por bloques carga más rápido porque usa tecnología moderna de renderizado. Esto es especialmente importante en mobile, donde la velocidad de carga impacta directamente en las conversiones.
- **Mejor experiencia mobile:** el checkout por bloques está diseñado desde cero para funcionar bien en pantallas chicas. Los campos se adaptan mejor, los botones son más grandes y el flujo es más intuitivo.
- **Personalización sin código:** los dueños de tiendas quieren poder personalizar su checkout sin contratar un desarrollador. El editor de bloques lo hace posible.
- **Alineación con WordPress:** WordPress está migrando todo hacia el editor de bloques. WooCommerce sigue esa dirección para mantenerse integrado con el ecosistema.

A partir de **WooCommerce 8.3+**, las instalaciones nuevas usan el checkout por bloques por defecto. Las tiendas existentes pueden migrar cuando quieran, y WooCommerce ofrece herramientas para hacer la transición de forma gradual.

## El problema de compatibilidad con plugins

Acá es donde las cosas se ponen importantes. Al igual que con [HPOS (High-Performance Order Storage)](https://correoargentinopro.com/blog/que-es-hpos-woocommerce.html), el checkout por bloques requiere que los plugins sean **específicamente compatibles**.

En el checkout clásico, los plugins agregaban campos, botones y opciones usando "hooks" de PHP, un sistema que lleva años funcionando y que todos los desarrolladores de WooCommerce conocen. El checkout por bloques usa un sistema completamente diferente basado en JavaScript y React. Esto significa que un plugin que funcionaba perfecto en el checkout clásico **puede no funcionar en el de bloques** si no fue actualizado.

Los plugins más afectados son:

- **Plugins de envío:** que muestran opciones, selectores o campos adicionales en el checkout (como selectores de sucursales, horarios de entrega, etc.).
- **Plugins de pago:** que agregan métodos de pago o modifican el formulario de pago. Te recomendamos revisar nuestra guía sobre los [mejores plugins de pago para WooCommerce en Argentina](https://correoargentinopro.com/blog/mejores-plugins-pago-woocommerce-argentina.html) para asegurarte de usar opciones compatibles.
- **Plugins de personalización del checkout:** que agregan campos extra, mensajes o modifican el layout.

Si un plugin no soporta el checkout por bloques, sus opciones simplemente **no aparecen** en el checkout. El cliente no ve el campo, el selector o la opción que el plugin debería mostrar. Esto puede causar problemas serios: imaginate que tu selector de sucursales no aparece y el cliente no puede elegir dónde retirar su paquete.

Por eso, antes de migrar al checkout por bloques, es fundamental verificar que todos los plugins que afectan al checkout sean compatibles. Si querés reducir el abandono de carrito en tu tienda, asegurar la compatibilidad del checkout es uno de los primeros pasos. Lee más sobre esto en nuestra guía de [cómo reducir el abandono de carrito en Argentina](https://correoargentinopro.com/blog/reducir-abandono-carrito-argentina.html).

## Cómo saber qué checkout usa tu tienda

Verificarlo es muy simple:

1. En tu panel de WordPress, anda a **Páginas** y busca la página de **Checkout** (o "Finalizar compra").
2. Editala.
3. Si ves **bloques en el editor** (como "Checkout" de WooCommerce con sub-bloques para dirección, envío, pago, etc.), estás usando el checkout por bloques.
4. Si ves un **shortcode** `[woocommerce_checkout]` en el contenido, estás usando el checkout clásico.

Cambiar de uno a otro es tan simple como editar esa página: podés borrar el shortcode e insertar el bloque de Checkout de WooCommerce, o viceversa. WooCommerce incluso te puede ofrecer un botón para hacer la conversión automáticamente.

Nuestra [guía completa de WooCommerce en Argentina](https://correoargentinopro.com/blog/woocommerce-argentina-guia-completa.html) cubre la configuración general de tu tienda, incluyendo cómo optimizar el checkout para el mercado argentino.

## Correo Argentino Pro y el checkout por bloques

[Correo Argentino Pro](https://correoargentinopro.com/) es **totalmente compatible con ambos tipos de checkout**: el clásico y el de bloques. Todas las funcionalidades del plugin funcionan de forma idéntica en los dos:

- **Cotización de envío en tiempo real:** las tarifas de Correo Argentino se calculan y muestran automáticamente, tanto en el checkout clásico como en el de bloques.
- **Selector de sucursales con mapa interactivo:** el [mapa de sucursales](https://correoargentinopro.com/blog/mapa-sucursales-correo-argentino-leaflet.html) funciona perfectamente en ambos checkouts. El cliente puede buscar, usar geolocalización y seleccionar sucursal sin importar qué versión de checkout uses.
- **Múltiples métodos de envío:** podés ofrecer envío a domicilio, retiro en sucursal o ambos, y todo se muestra correctamente en cualquier checkout.
- **Datos del envío en el pedido:** toda la información (sucursal elegida, cotización, tipo de envío) se guarda en el pedido de WooCommerce de forma nativa.

No necesitas configurar nada distinto según el tipo de checkout que uses. Instala el plugin, configura tus métodos de envío y Correo Argentino Pro detecta automáticamente qué tipo de checkout tiene tu tienda y se adapta. Podés ver el proceso completo en nuestra guía sobre [cómo integrar Correo Argentino con WooCommerce](https://correoargentinopro.com/blog/como-integrar-correo-argentino-woocommerce.html).

## Preguntas frecuentes

### ¿Qué es el checkout por bloques de WooCommerce?

Es el nuevo sistema de checkout de WooCommerce que reemplaza al clásico. En vez de generar la página con el shortcode `[woocommerce_checkout]`, usa el **editor de bloques de WordPress** (Gutenberg): la página está compuesta por bloques individuales que podés mover, agregar o quitar desde el editor visual, sin tocar código. Además carga más rápido y soporta funcionalidades nuevas que el checkout clásico no puede usar.

### ¿Cómo sé si mi tienda usa el checkout clásico o el de bloques?

En tu panel de WordPress andá a **Páginas**, buscá la página de **Checkout** (o "Finalizar compra") y editala. Si ves **bloques en el editor**, con el bloque "Checkout" de WooCommerce y sus sub-bloques para dirección, envío y pago, estás usando el checkout por bloques. Si en el contenido ves el shortcode `[woocommerce_checkout]`, seguís con el clásico.

### ¿Desde qué versión de WooCommerce el checkout por bloques es el predeterminado?

A partir de **WooCommerce 8.3+**, las instalaciones nuevas usan el checkout por bloques por defecto. Las tiendas existentes pueden migrar cuando quieran, y WooCommerce ofrece herramientas para hacer la transición de forma gradual.

### ¿Qué pasa si un plugin no es compatible con el checkout por bloques?

Sus opciones **simplemente no aparecen** en el checkout: el cliente no ve el campo, el selector ni la opción que el plugin debería mostrar. Esto ocurre porque el checkout clásico se extiende con hooks de PHP y el de bloques usa un sistema basado en JavaScript y React. Es especialmente riesgoso con plugins de envío: si el selector de sucursales no aparece, el cliente no puede elegir dónde retirar su paquete.

## Nuestra recomendación

Si estás creando una tienda nueva, usa el checkout por bloques. Es el estándar actual de WooCommerce, carga más rápido, se ve mejor y te da más flexibilidad para personalizar.

Si tenés una tienda existente con el checkout clásico, no hay urgencia por migrar, pero te conviene planificarlo. Antes de hacer el cambio:

1. Verifica que todos tus plugins de envío, pago y checkout sean compatibles con bloques.
2. Hacé la migración en un entorno de pruebas o de staging primero.
3. Probá el checkout completo (seleccionar producto, elegir envío, pagar) para asegurarte de que todo funcione.
4. Una vez que esté todo bien, activa el cambio en producción.

Con [Correo Argentino Pro](https://correoargentinopro.com/) no tenés que preocuparte por la compatibilidad: el plugin funciona en ambos checkouts sin ningún ajuste. Probá el plugin gratis por 15 días y comprobalo vos mismo.

Si tenés dudas sobre cómo migrar tu checkout o sobre la compatibilidad con tus plugins, visita nuestras [preguntas frecuentes](https://correoargentinopro.com/faqs.html) o [contactanos](https://correoargentinopro.com/contacto.html) y te ayudamos.
