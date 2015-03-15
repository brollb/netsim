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
    Utils.guaranteeFns(this, 'start', 'onMessageReceived');

    // This is an unfortunate coupling
    this.netsim = simulator;
};

/**
 * Send a message to another node in the system.
 *
 * @param {String} dstId
 * @param msg
 * @return {undefined}
 */
App.prototype.sendMessage = function(dstId, msg) {
    var internalMsg = {route: this.netsim.getRoute(this.uuid, dstId),
                       body: msg};

    this._sendMessage(internalMsg);
};

/**
 * Internal sendMessage function. This is called during the intermediate hops.
 *
 * @private
 * @param dstId
 * @param msg
 * @return {undefined}
 */
App.prototype._sendMessage = function(msg) {
    var nextNode = msg.route.shift(),
        latency = this.netsim.getLatency(this.uuid, nextNode),
        isDropped = this.netsim.isDropped(this.uuid, nextNode);

    if (!isDropped && !!nextNode) {
        this.send(msg, latency, nextNode);
    }
};

/**
 * Callback used by SimJS on event message received. Determine if it should
 * be passed on or passed to the user defined app.
 *
 * @param {Function} fn
 * @return {App} this
 */
App.prototype.onMessage = function(sender, msg) {
    var isMyMsg = msg.route.length === 0;

    // Check if the message has reached it's destination
    if (isMyMsg) {
        // If so, call onMessageReceived passing the body of the msg
        this.onMessageReceived(sender, msg.body);
    } else {
        // Else, get the next destination node and pass it along
        this._sendMessage(msg);
    }
};

module.exports = App;
