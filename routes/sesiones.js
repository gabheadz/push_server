var _ = require('lodash');
var Promise = require('bluebird');

var sesiones = [];

/**
 * Registra una sesion en el cache de sesiones.
 * 
 * @param {any} socket - La conexión websocket realizada por un cliente
 * @param {string} data - La informacion adicional sobre el cliente de la cual se extraera el Key.
 */
exports.registrar = function(socket, data) {
    return new Promise(function(resolve, reject){
        let sesion = {"id":socket.id, "ip": socket.handshake.address, "key": data};
        console.log("websocket client ",sesion);
        sesiones.push(sesion);
        console.log("sesiones: ", sesiones.length);
        resolve(sesion);
    });
}

/**
 * Obtiene 0..N sesiones existentes en el cache de sesiones.
 * 
 * @param {string} key - La clave del cliente con la que se hara la busqueda de sesiones.
 */
exports.obtener = function(key) {
    return new Promise(function(resolve, reject){
        resolve(
            _.filter(sesiones, function(e) {
                return e.key == key;
            })
        );
    });
}
