# Push server for webclients

Simple server for pushing notifications to webclients.

## Running Push Server

1) Install dependencies

```
npm install
```

2) Run server

```
npm start
```


## Web Client Configuration

1. Add **Socket.io** library:

    ```
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script>
    ```

2. Establish comunication with push server

    ```
    <script>
	//connect with push server
	var socket = io('http://localhost:3000'); 
	
	//sign up event. Requieres a string to act as an identifier of the webclient
	socket.emit('signup', 'my-key');
        
	//event fired after signup
	socket.on('signup.status', function(msg){
            if (msg.status == 0) 
	        //OK: webclient connected and ready to receive notifications
            else 
		//Error: webclient not connected.
        });
	
	//event fired when receiving push notification
        socket.on('push.notification', function(msg){
          //msg is the payload in Json format
        });    
    </script>
    ```
   

## Publisher 

The publisher as a role, can be implemented by any backend or system which needs to send messages to webclients.

Publishers do this by calling ```/publish``` on the push server, the body contains the payload or message:

```
POST /publish HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Cache-Control: no-cache

{
	"clientKey": "the-client-key", //the key that identifies a webclient
	"payload": "This is the message to be delivered."
}
```
