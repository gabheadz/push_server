var _ = require('lodash');
var sesiones = require('./sesiones');

/**
 * Function que recibe la solicitud para publicar un mensaje cliente web.
 */
exports.publicar = function(req, res) {
    if (validarCuerpo(req.body)) {
        let key = req.body.destino;
        sesiones.obtener(key).then(function (_data) {
            _.forEach(_data, function(s) {
                req.wsio.to(s.id).emit('notification.message', req.body.mensaje);
            });
        });
        res.status(200).json({"estado":0, "resultado":"mensaje enviado"}); 
    } else {
        res.status(400).json({"estado":1, "resultado":"cuerpo no valido"});     
    }
}

/**
 * Valida que el cuerpo publicado cumpla la estructura requerida
 * 
 * @param {string} cuerpo en formato json 
 */
var validarCuerpo = function(cuerpo) {
    if (!cuerpo) return false;
    if (!cuerpo.destino) return false;
    if (!cuerpo.mensaje) return false;
    return true;
}