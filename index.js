var app = require('express')();

var server = require('http').Server(app);
var bodyParser = require('body-parser');

var io = require('socket.io')(server);
var sessions = require('./appmodules/sessions');
var publisher = require('./appmodules/publisher');

// for parsing application/json
app.use(bodyParser.json()); 

//injects io object into request
app.use(function(req, res, next) {
  req.wsio = io;
  next();
});

/* for serving demo files */
app.use(require('express').static('static'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/static/index.html');
});

//API endpoint for publishing messages to webclients
app.post('/publish', publisher.publish);

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

var port = process.env.PORT || 3000;
server.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:' + port);
});
