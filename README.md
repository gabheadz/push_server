# Push server for webclients

Simple server for pushing notifications to webclients.

## Web Client Configuration

1. Add **Socket.io** library:

    ```
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script>
    ```

2. Establish comunication with push server

    ```
    <script>
        var socket = io('http://localhost:3000'); 
        socket.emit('signup', 'my-key');
        socket.on('signup.result', function(msg){
            if (msg.estado == 0) 
                //OK: webclient connected and ready to receive notifications
            else 
                //Error: webclient not connected.
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

