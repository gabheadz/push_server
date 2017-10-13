var sticky = require('socketio-sticky-session');
var cluster = require('cluster');

var options = {
  num: 3,
  proxy: true, //activate layer 4 patching
  header: 'x-forwarded-for', //provide here your header containing the users ip
  ignoreMissingHeader: true,
  sync: {
    isSynced: false, //activate synchronization
    event: 'mySyncEventCall' //name of the event you're going to call
  }
}

var server = sticky(options, function() {

  var express = require('express');
  var server = require('http').Server(app);
  var bodyParser = require('body-parser');
  var sio = require('socket.io');
  var sio_redis = require('socket.io-redis');

  var sessions = require('./appmodules/sessions');
  var publisher = require('./appmodules/publisher');

  // Note we don't use a port here because the master listens on it for us.
	var app = new express();

	// Don't expose our internal server to the outside.
	var server = app.listen(0, 'localhost'),
      io = sio(server);
          
  //injects io object into request
  app.use(function(req, res, next) {
    req.wsio = io;
    next();
  });      

  app.use(bodyParser.json()); 

  //for serving demo files
  app.use(require('express').static('static'));
  app.get('/', function(req, res){
    res.sendFile(__dirname + '/static/index.html');
  });

  //API endpoint for publishing messages to webclients
  app.post('/publish', publisher.publish);

	// Tell Socket.IO to use the redis adapter. By default, the redis
	// server is assumed to be on localhost:6379. You don't have to
	// specify them explicitly unless you want to change them.
	io.adapter(sio_redis({ host: 'localhost', port: 6379 }));

	// Socket.IO events.
  io.on('connection', function(socket) {
    //web client should emit an event called 'sign.up' with a payload that 
    //will serve a key in sessionsCache
    socket.on('signup', function(payload){
      sessions.add(socket,payload).then(function(signupOutcome) {
        //emit successful signup.status event to client
        io.to(socket.id).emit('signup.status', 
          {"status":0, "result": signupOutcome}
        );
      }, function(err) {
        //emit signup.status event with error information to client
        io.to(socket.id).emit('signup.status', 
          {"status":1, "result":err}
        );      
        socket.disconnect(true);
      });
    });
  });

  return server;
}).listen(3000, function() {
  if (cluster.isMaster)
    console.log('server started on 3000 port');
  else
    console.log(`Worker ${process.pid} started`);
});

server.on( 'connection', function( socket ) {
  // ... awesome stuff
  server.emit( 'mySyncEventCall' );
});

