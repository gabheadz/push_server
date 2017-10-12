var _ = require('lodash');
var sessions = require('./sessions');

/**
 * this function search for a websocket session, identified by a key, and
 * send a json payload to that websocket client.
 */
exports.publish = function(req, res) {
    if (validateBody(req.body)) {
        sessions.get(req.body.clientKey).then(function (_result) {
            _.forEach(_result, function(s) {
                //iterate over sessions thah match given key, and push the payload.
                req.wsio.to(s.id).emit('push.notification', req.body.payload);
            });
        });
        res.status(200).json({"status":0, "result":"message delivered"}); 
    } else {
        res.status(400).json({"status":1, "result":"check body structure"});     
    }
}

/**
 * Checks body submitted. 
 * 
 * @param {string} body in json format 
 */
var validateBody = function(body) {
    if (!body) return false;
    if (!body.clientKey) return false;
    if (!body.payload) return false;
    return true;
}