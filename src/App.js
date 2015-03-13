/*
 * Decorator for NetSim Apps. Internal use only.
 */

'use strict';

var Utils = require('./Utils');

/**
 * App
 *
 * @constructor
 * @param {String} id
 * @return {undefined}
 */
var App = function(node, simulator) {
    // Copy node to 'this'
    Utils.copyObject(this, node);

    // Guarrantee that it has the necessary functions
    Utils.guaranteeFns(this, 'start', 'onMessageReceived');

    // This is an unfortunate coupling
    this.sim = simulator;
};

/**
 * Send a message to another node in the system.
 *
 * @param {String} dstId
 * @param msg
 * @return {undefined}
 */
App.prototype.sendMessage = function(dstId, msg) {
    var internalMsg = {route: Utils.getRoute(this.id, dstId),
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
    var nextNode = msg.route.unshift(),
        latency = this.sim.getLatency(this.id, nextNode),
        isDropped = this.sim.isDropped(this.id, nextNode);

    if (!isDropped) {
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
    var isMyMsg = msg.route.length === [];

    // Check if the message has reached it's destination
    if (isMyMsg) {
        // If so, call onMessageReceived passing the body of the msg
        this.onMessageReceived(sender, msg);
    } else {
        // Else, get the next destination node and pass it along
        this._sendMessage(msg);
    }
};

module.exports = App;
