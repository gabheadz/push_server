var app = require('express')();

var server = require('http').Server(app);
var bodyParser = require('body-parser');

var io = require('socket.io')(server);
var sesiones = require('./routes/sesiones');
var publicador_api = require('./routes/publicador_api');

app.use(bodyParser.json()); // for parsing application/json

app.use(function(req, res, next) {
  req.wsio = io;
  next();
});

app.use(require('express').static('static'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/static/index.html');
});

app.post('/publicar', publicador_api.publicar);

/**
 * registro del cliente web
 */
io.on('connection', function(socket) {

  //evento llamado 'registrar' con un payload string que se convertira
  //en el Key con el que se almacenara en memoria la sesion wss
  socket.on('registrar', function(msg){
    sesiones.registrar(socket,msg).then(function(data) {
      io.to(socket.id).emit('estado.registro', 
        {"estado":0, "resultado":data}
      );
    }, function(err) {
      io.to(socket.id).emit('estado.registro', 
        {"estado":1, "resultado":err}
      );      
      socket.disconnect(true);
    });
  });
});

var port = process.env.PORT || 3000;
server.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:' + port);
});
