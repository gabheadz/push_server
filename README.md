# Servidor de Notificaciones PUSH 

Este es el componente de Servidor para las notificaciones push de las aplicaciones que cumplen
la Arquitectura de Referencia de Protección.

## Arquitectura

La arquitectura definica es la siguiente:

- **Cliente web**: esta es una aplicación web que desea recibir las 
    notificaciones vía websockets. En la arquitectura de referencia de Protección,
    este rol lo tiene la parte UI (angular o React) de la Micro-Aplicación.
- **Backend notificaciones**: este es el servidor de notificaciones quien 
    enviará notificaciones a los clientes web (este proyecto).
- **Notificador**: este es quien cumple el rol de notificar o publicar mensajes 
    que serán enviados al cliente web y quien se vale del *Backend de notificaciones* 
    como intermediario. En la arquitectura de referencia de Protección, este rol lo
    tiene la parte API Java de la Micro-aplicación.


Este proyecto implementa el **Backend notificaciones**.

## Guia Rápida

Esta guia indica como desplegar el **Backend Notificaciones**.

1. Si la imagen docker no está construida.

    a) Clonar el repositorio

    ```
    git clone https://vostpmde37.proteccion.com.co:10443/ARQ_Referencia/push_server.git
    ```
    
    b) Construir la imagen
    
    ```
    docker build -t arq_ref/push_server .
    ```
    
    c) Ejecutar la imagen

    ```
    docker run -p 3000:3000 -d arq_ref/push_server
    ```

2. Si la imagen docker ya esta construida.

    ```
    docker run -p 3000:3000 -d arq_ref/push_server
    ```

### Guia adicional:  Cliente Web

Para que un cliente web pueda recibir notificaciones debe realizarse la siguiente
configuracion:

1. Agregar la referencia a la libreria **Socket.io**

    ```
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script>
    ```

2. Establecer conexion websocket con el **Backend-notificaciones** y suscribirse
   a eventos.

    ```
    <script>
        var socket = io('http://localhost:3000'); //url del push server
        socket.emit('registrar', 'my-key');
        socket.on('estado.registro', function(msg){
            if (msg.estado == 0) 
                //Exito: Cliente web subscrito 
            else 
                //Error: Cliente web no se ha suscrito.
        });
        socket.on('notification.message', function(msg){
          //Aqui recibira todas las notificaciones. [msg] contiene el mensaje publicado.
        });    
    </script>
    ```

Donde:

- **registrar** es el evento que el cliente web va a emitirle al backend de 
    notificaciones para suscribirse ó "darse de alta".
    - **my-key** es una llave única que este cliente web usará para identificarse 
        (se recomienda usar el JWT que la aplicación tiene como resultado de la autenticación).

- **estado.registro** es el evento al que se va a suscribir el cliente web para 
    esperar confirmación sobre si la suscripción fue exitosa o no.
    - **msg** es el cuerpo de la confirmación de la suscripción.

- **notification.message** es el evento al que se va a suscribir el cliente web para 
    recibir las notificaciones enviadas.
    - **msg** es el cuerpo de la notificacion recibida.
    

### Guia adicional:   Notificador

El notificador enviará mensajes al endpoint Rest ```/publicar``` del **Backend notificaciones**,
enviando en el cuerpo de la petición, un payload como el que se describe a continuación:

```
POST /publicar HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{
	"destino": "my-key",
	"mensaje": "La solicitud XYZ fue grabada exitosamente."
}
```

Donde:

- **my-key** es un key que identifica a un cliente web, al cual se le desea 
    enviar la notificación. El notificador debe enviar aqui el id que identifica 
    el JWT que el cliente web siempre envia al API Java, y que se puede obtener
    por Jano.
- **mensaje** es el mensaje propiamente dicho que se le desea enviar al cliente web.

