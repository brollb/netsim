/*
 * A network simulator wrapper around SimJS
 *
 * @author brollb / https://github.com/brollb
 */

'use strict';

var Sim = require('simjs');

var NetworkSimulator = function() {
};

/**
 * Load a network topology.
 *
 * @return {undefined}
 */
NetworkSimulator.prototype.loadNetwork = function(network) {
    // nodes in the network will be given a uuid which associates them to
    // the entities in the simulation
    // TODO
};

/**
 * Add a node to the network. UUID of the node should be present in the 
 * network topology.
 *
 * @param node
 * @return {undefined}
 */
NetworkSimulator.prototype.addNode = function(node) {
    // Add a node to the simulation. It should have a uuid which is present
    // somewhere in the network topology
    // TODO
};

/**
 * Start the simulation.
 *
 * @return {undefined}
 */
NetworkSimulator.prototype.start = function() {
    // Start the simulation
    // TODO
};

module.exports = NetworkSimulator;
