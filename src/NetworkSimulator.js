/*
 * A network simulator wrapper around SimJS
 *
 * @author brollb / https://github.com/brollb
 */

'use strict';

var Sim = require('simjs'),
    App = require('./App');

/**
 * @constructor
 *
 * @param [network] - network topology
 * @return {undefined}
 */
var NetworkSimulator = function(network) {
    this.sim = new Sim();
    this.network = network;
};

/**
 * Add a node to the network. UUID of the node should be present in the 
 * network topology.
 *
 * @param node
 * @return {undefined}
 */
NetworkSimulator.prototype.addNode = function(node) {
    this._validateNode(node);

    // Guarrantee that it has a start function
    var app = new App(node, this);
    // Add sendMessage, _sendMessage function
    // Decorate node with necessary functions

    // Guarrantee that it has a start function

    // TODO

    return this.sim.addEntity(app);
};

/**
 * Check that the node has the proper structure.
 *
 * @throws {InvalidNodeException}
 * @param {Object} node
 * @return {undefined}
 */
NetworkSimulator.prototype._validateNode = function(node) {
    // Node must:
    //    + have a id
    //    + be in the network topology
    //    + not have "sent" method -- will be overridden
    var isValid = true;

    isValid = node.id !== undefined &&
              this._networkContains(node) && 
              node.send === undefined;

    if (!isValid) {
        throw new Error('Invalid node:', node);
    }
};

/**
 * Check if the network topology contains the given node
 *
 * @private
 * @param {App} node
 * @return {boolean}
 */
NetworkSimulator.prototype._networkContains = function(node) {
    var exists = false,
        link,
        i = this.network.length;

    while (!exists && i--) {
        link = this.network[i];
        exists = link.src === node.id || link.dst === node.id;
    }

    //console.log('network contains '+node.id+'? '+exists);

    return exists;
};

/**
 * Start the simulation.
 *
 * @return {undefined}
 */
NetworkSimulator.prototype.simulate = function() {
    // Start the simulation
    // Convert all remaining nodes in the topology to dumb routers
    this.sim.simulate();
};

NetworkSimulator.prototype.getLatency = function(srcId, dstId) {
    // FIXME: set a variable latency
    return 10;
};

NetworkSimulator.prototype.isDropped = function(srcId, dstId) {
    // FIXME: 
    return false;
};

NetworkSimulator.prototype.getRoute = function(srcId, dstId) {
    // FIXME: Add actual routing
    return [];
};

module.exports = NetworkSimulator;
