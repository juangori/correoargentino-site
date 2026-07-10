> Fuente: https://correoargentinopro.com/ayuda.html

# Centro de Ayuda

## Introduccion

Correo Argentino Pro es un plugin premium para WooCommerce que integra tu tienda con Correo Argentino. Con el podes cotizar envíos en tiempo real, crear envíos, generar etiquetas, hacer seguimiento automático y mucho mas.

#### Activa tu licencia

Ingresa tu clave de licencia en el wizard de configuración inicial o en Configuración > Licencia.

#### Elegi tu servicio

Selecciona entre MiCorreo (PyMEs) o Paq.Ar (empresas con acuerdo comercial).

#### Configura tus credenciales

Carga los datos de tu cuenta de MiCorreo o tu API Key de Paq.Ar.

#### Completa los datos del remitente

Ingresa tu direccion de origen para cotizaciones y envíos.

## Que servicio elegir

El plugin soporta dos plataformas de Correo Argentino. Elegi la que corresponda según tu tipo de cuenta:

|  | MiCorreo | Paq.Ar |
|---|---|---|
| **Para quien** | PyMEs, monotributistas, emprendedores | Empresas con acuerdo comercial |
| **Cuenta necesaria** | MiCorreo | Acuerdo con Correo Argentino |
| **Cotización automatica** | Si | No (tarifa fija configurable) |
| **Etiquetas/Rotulos** | Desde el panel de MiCorreo | Generadas desde el plugin |
| **Cancelar envíos** | Desde el panel de MiCorreo | Desde WooCommerce |
| **Credenciales** | Email, contrasena, Customer ID | API Key, ID de Acuerdo |

[Artículo relacionado: ¿Qué es MiCorreo de Correo Argentino? →](https://correoargentinopro.com/blog/que-es-micorreo-correo-argentino.html)

## Configurar MiCorreo

Segui estos pasos para conectar tu cuenta de MiCorreo con el plugin:

#### Crea tu cuenta en MiCorreo

Si aun no tenes cuenta, registrate en **MiCorreo**. Es gratuito y esta disponible para PyMEs, monotributistas y emprendedores.

#### Obtene tu Customer ID

El Customer ID se obtiene automáticamente al validar tu cuenta en el plugin, o podes ingresarlo manualmente. Lo encontras en tu perfil de MiCorreo.

#### Carga las credenciales

Anda a **Correo Arg. Pro > Configuración**, selecciona "MiCorreo" como servicio e ingresa tu email, contrasena y Customer ID.

#### Proba la conexion

Usa el boton "Probar conexion" en la pagina de configuración, o anda a **Diagnostico** para verificar que todo este correcto.

[Artículo relacionado: Cómo integrar Correo Argentino con WooCommerce →](https://correoargentinopro.com/blog/como-integrar-correo-argentino-woocommerce.html)

## Configurar Paq.Ar

Para usar Paq.Ar necesitas un acuerdo comercial con Correo Argentino:

#### Tene tu acuerdo comercial

Paq.Ar esta disponible para empresas que tienen un acuerdo comercial vigente con Correo Argentino.

#### Obtene tus credenciales

Correo Argentino te proporcionara un **API Key** y un **ID de Acuerdo** para usar la API de Paq.Ar.

#### Carga API Key y Acuerdo

En **Correo Arg. Pro > Configuración**, selecciona "Paq.Ar" como servicio e ingresa tu API Key y el ID de Acuerdo.

#### Proba la conexion

Usa el boton "Probar conexion" para verificar que las credenciales sean correctas y la API responda.

[Artículo relacionado: Paq.Ar y WooCommerce: Guía completa →](https://correoargentinopro.com/blog/paqar-woocommerce.html)

## Datos del remitente

Los datos del remitente se usan como direccion de origen para el cálculo de tarifas, la creacion de envíos y la generación de etiquetas.

#### Campos obligatorios

- **Razon social / Nombre del negocio**
- **Calle y numero**
- **Ciudad**
- **Provincia** (codigo de Correo Argentino)
- **Codigo postal** (CPA de 4 digitos)

**Importante:** Es fundamental que el codigo postal sea correcto, ya que afecta directamente el cálculo de tarifas.

Configura estos datos en **Correo Arg. Pro > Configuración > Datos del remitente** o durante el wizard de configuración inicial.

## Zona de envío

Para que Correo Argentino aparezca como opción en el checkout, necesitas agregarlo a una zona de envío de WooCommerce:

#### Anda a Zonas de envío

En tu WordPress, anda a **WooCommerce > Ajustes > Envío > Zonas de envío**.

#### Edita o crea una zona

Selecciona una zona existente (por ejemplo, "Argentina") o crea una nueva que cubra las regiones donde queres enviar.

#### Agrega el metodo de envío

Hace clic en "Agregar metodo de envío" y selecciona **Correo Argentino Pro**.

#### Configura el tipo de entrega

Elegi entre **Envío a domicilio** o **Retiro en sucursal**. Tambien podes seleccionar el tipo de servicio: Clasico (CP) o Express.

#### Tip

Podes agregar el metodo dos veces en la misma zona: una vez para "Envío a domicilio" y otra para "Retiro en sucursal", asi tus clientes pueden elegir.

[Artículo relacionado: Zonas de envío de Correo Argentino →](https://correoargentinopro.com/blog/zonas-envio-correo-argentino.html)

## Flujo de un pedido

Este es el ciclo de vida de un pedido con Correo Argentino Pro:

#### El cliente compra

El cliente realiza la compra y selecciona Correo Argentino como metodo de envío en el checkout. Si eligio retiro en sucursal, ve un mapa interactivo para elegir la sucursal.

#### Se verifica el pago

Cuando el pago se confirma, el pedido pasa a estado "Procesando".

#### Se crea el envío

El envío se crea en Correo Argentino, ya sea automáticamente (si tenes la opción activada) o manualmente desde el detalle del pedido.

#### Etiqueta y despacho

Descarga la etiqueta de envío (PDF), pegala en el paquete y despacha. El tracking se actualiza automáticamente.

## Envío a sucursal

Cuando el cliente elige "Retiro en sucursal" en el checkout, se le muestra un selector interactivo con las siguientes funcionalidades:

- **Mapa interactivo:** Muestra todas las sucursales de Correo Argentino en un mapa con Leaflet.
- **Busqueda:** El cliente puede buscar por nombre de sucursal o direccion.
- **Geolocalizacion:** Si el cliente lo permite, las sucursales se ordenan por distancia.
- **Distancia:** Se muestra la distancia a cada sucursal desde la ubicacion del cliente.

Al seleccionar una sucursal, los campos de direccion se completan automáticamente y quedan como solo lectura. La sucursal seleccionada se guarda con el pedido.

[Artículo relacionado: Envío a sucursal vs domicilio →](https://correoargentinopro.com/blog/envio-sucursal-vs-domicilio-correo-argentino.html)

## Etiquetas y rotulos

El proceso para obtener las etiquetas depende del servicio que uses:

#### MiCorreo

1. Ingresa al panel de MiCorreo
2. Busca el envío por numero de tracking
3. Descarga el PDF del rotulo
4. Imprimilo y pegalo en el paquete

Las etiquetas de MiCorreo se gestionan directamente desde su plataforma.

#### Paq.Ar

1. Anda al detalle del pedido en WooCommerce
2. En el metabox de Correo Argentino Pro, hace clic en "Generar rotulo"
3. El PDF se descarga automáticamente
4. Tambien podes generarlos en lote desde la lista de pedidos

## Seguimiento de envíos

El plugin sincroniza automáticamente el estado de todos los envíos activos cada 6 horas. Tambien podes actualizar manualmente desde el detalle del pedido.

### Estados de envío

| Estado | Descripcion |
|---|---|
| Creado | Registrado en Correo Argentino, pendiente de despacho. |
| Retirado | Correo Argentino retiro el paquete. |
| En transito | El paquete esta en camino al destino. |
| En reparto | Sale a reparto hoy, se entrega en el dia. |
| Entregado | Entregado al destinatario exitosamente. |
| Devuelto | No se pudo entregar, devuelto al remitente. |
| Cancelado | El envío fue cancelado. |

### Donde ve el cliente el tracking

- **Mi Cuenta:** En el detalle del pedido, con un timeline visual del estado.
- **Emails:** Recibe notificaciones automáticas cuándo el estado cambia.
- **Pagina publica:** Podes crear una pagina de tracking con el shortcode `[cap_tracking]`.

## Acciones masivas

Desde la lista de pedidos de WooCommerce podes realizar acciones sobre multiples pedidos a la vez:

- **Crear envíos:** Crea envíos en Correo Argentino para todos los pedidos seleccionados.
- **Generar etiquetas:** Genera los rotulos PDF de todos los pedidos seleccionados (solo Paq.Ar).
- **Actualizar tracking:** Sincroniza el estado de seguimiento de los pedidos seleccionados.

Para usarlas, selecciona los pedidos con las casillas de verificacion, elegi la accion del menu desplegable "Acciones en lote" y hace clic en "Aplicar".

## Tarifas con Paq.Ar

Paq.Ar no ofrece cotización automatica por API. En su lugar, podes configurar una tarifa fija para tus clientes:

- **Tarifa fija:** Configura un monto fijo en pesos que se mostrara en el checkout.
- **Envío gratis condicional:** Podes ofrecer envío gratis a partir de un monto mínimo de carrito.
- **Envío siempre gratis:** Configura la tarifa en $0 para ofrecer envío gratis en todos los pedidos.

Estos valores se configuran al editar el metodo de envío dentro de la zona de envío correspondiente en **WooCommerce > Ajustes > Envío**.

## Auto-completar al entregar

Cuando esta opción esta activada, el plugin marca automáticamente el pedido como "Completado" cuándo el tracking indica que el paquete fue entregado.

- Solo aplica a pedidos en estado "Procesando".
- Se agrega una nota al pedido indicando que fue completado automáticamente.
- El cliente recibe el email de pedido completado de WooCommerce.

Activa esta opción en **Correo Arg. Pro > Configuración > Opciones avanzadas**.

## Exportar a CSV

Desde el Dashboard del plugin podes exportar los envíos recientes a un archivo CSV. El archivo incluye:

- Numero de pedido
- Numero de tracking
- Estado del envío
- Fecha de creacion

Hace clic en el boton "Exportar CSV" en la seccion de envíos recientes del Dashboard.

## Validador de productos

El plugin detecta productos que no tienen peso o dimensiones configurados y muestra un aviso en el Dashboard y en la lista de productos de WooCommerce.

#### Por qué es importante

Los productos sin peso ni dimensiones usan valores por defecto (1 gramo, 1 cm) que generan cotizaciones incorrectas. Esto puede hacer que tus clientes paguen de mas o de menos por el envío.

**Como corregirlo:** Edita el producto en WooCommerce > Productos, anda a la pestaña "Envío" e ingresa el peso (en kg) y las dimensiones (en cm).

## Modo Sandbox

El modo Sandbox te permite probar toda la integración sin crear envíos reales. Es ideal para:

- Probar el flujo completo de compra antes de salir a produccion.
- Verificar que las cotizaciones, creacion de envíos y etiquetas funcionen correctamente.
- Hacer pruebas de integración sin afectar tu cuenta real.

#### Importante

Recorda desactivar el modo Sandbox antes de poner tu tienda en produccion. Los envíos creados en Sandbox no son reales y no se van a despachar.

Activa o desactiva el Sandbox en **Correo Arg. Pro > Configuración > Conexion API**.

## Errores comunes

#### "Customer ID de MiCorreo no configurado"

Falta el Customer ID en la configuración. Anda a **Configuración > Conexion API** e ingresa tu Customer ID. Se obtiene automáticamente al validar tu cuenta o lo encontras en tu perfil de MiCorreo.

#### "Servicio no configurado"

No seleccionaste un servicio. Anda a **Configuración > Conexion API** y elegi MiCorreo o Paq.Ar.

#### "El envío aun no fue creado"

Si tenes la creacion automatica activada, el envío se crea cuándo el pedido pasa a "Procesando" o "Completado". Si el pedido esta en otro estado, cambialo manualmente o crea el envío desde el detalle del pedido.

#### "No aparece Correo Argentino en el checkout"

Verifica que:

- El metodo de envío esta agregado a una zona que cubra la direccion del cliente.
- Los productos del carrito tienen peso y dimensiones.
- Las credenciales estan configuradas correctamente.
- El codigo postal del cliente es valido.

#### "Tarifa muestra $0 o un valor incorrecto"

Verifica que todos los productos del carrito tengan peso y dimensiones configurados. Los productos sin estos datos usan valores por defecto que generan cotizaciones incorrectas.

#### "Conexion API — Error"

Puede ser por credenciales incorrectas, la API de Correo Argentino temporalmente caida, o un firewall bloqueando las conexiones salientes. Verifica tus credenciales y proba de nuevo.

#### "No puedo cancelar un envío de MiCorreo"

Los envíos de MiCorreo solo se pueden cancelar desde el panel de MiCorreo directamente. Esta es una limitacion de la plataforma.

#### "El Dashboard muestra numeros incorrectos"

Las estadisticas del Dashboard se cachean durante 15 minutos. Espera un momento y recarga la pagina para ver los valores actualizados.
