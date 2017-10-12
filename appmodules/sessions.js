var _ = require('lodash');
var Promise = require('bluebird');

var sessionsCache = [];

/**
 * Register a web socket client in a local cache.
 * 
 * @param {any} socket - the websocket client
 * @param {string} data - payload sent by client, acts like a KEY.
 */
exports.add = function(socket, data) {
    return new Promise(function(resolve, reject){
        var sesion = {"id":socket.id, "ip": socket.handshake.address, "key": data};
        console.log("websocket client ",sesion);
        sessionsCache.push(sesion);
        console.log("# of sessions: ", sessionsCache.length);
        resolve(sesion);
    });
}

/**
 * Get 0..N sessions matching a key in sessionsCache.
 * 
 * @param {string} key - key to search in the sessionsCache.
 */
exports.get = function(key) {
    return new Promise(function(resolve, reject){
        resolve(
            _.filter(sessionsCache, function(e) {
                return e.key == key;
            })
        );
    });
}
