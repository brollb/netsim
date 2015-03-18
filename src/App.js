/*
 * Decorator for NetSim Apps. Internal use only.
 */

'use strict';

var Utils = require('./Utils');

/**
 * App
 *
 * @constructor
 * @param {Object} node
 * @param {NetworkSimulator} simulator
 * @return {undefined}
 */
var App = function(node, simulator) {
    // Copy node to 'this'
    Utils.copyObject(this, node);

    // Guarrantee that it has the necessary functions
    Utils.guaranteeFns(this, 'start', 'onStart', 'onMessageReceived');

    // This is an unfortunate coupling
    this.netsim = simulator;
};

/**
 * Send a message to another node(s) in the system.
 *
 * @param {String|Array} dstId
 * @param msg
 * @return {undefined}
 */
App.prototype.sendMessage = function(dstIds, msg) {
    var internalMsg,
        dstId;

    if (!dstIds instanceof Array) {
        dstIds = [dstIds];
    }

    for (var i = dstIds.length; i--;) {
        dstId = dstIds[i];
        internalMsg = {route: this.netsim.getRoute(this.uuid, dstId),
                       origin: this.uuid,
                       body: msg};

        this._sendMessage(internalMsg);
    }
};

/**
 * Internal sendMessage function. This is called during the intermediate hops.
 *
 * @private
 * @param msg
 * @return {undefined}
 */
App.prototype._sendMessage = function(msg) {
    var nextNode = msg.route.shift(),
        latency = this.netsim.getLatency(this.uuid, nextNode.uuid),
        isDropped = this.netsim.isDropped(this.uuid, nextNode.uuid);

    if (!isDropped && !!nextNode) {
        this.send(msg, latency, nextNode);
    }
};

/**
 * Callback for any receiving all messages. This method will either forward 
 * the message or pass it to it's own callback (depending on the intended
 * recipient).
 *
 * @private
 * @return {undefined}
 */
App.prototype.onMessage = function(sender, msg) {
    var isMyMsg = msg.route.length === 0;

    // Check if the message has reached it's destination
    if (isMyMsg) {
        // If so, call onMessageReceived passing the body of the msg
        this.onMessageReceived(msg.origin, msg.body);
    } else {
        // Else, get the next destination node and pass it along
        this._sendMessage(msg);
    }
};

module.exports = App;
