/*
 * A network simulator wrapper around SimJS
 *
 * @author brollb / https://github.com/brollb
 */

'use strict';

var Sim = require('simjs'),
    normalRandom = require('gauss-random'),
    BasicRouter = require('./BasicRouter'),
    App = require('./App'),
    Utils = require('./Utils');

/**
 * @constructor
 *
 * @param [network] - network topology
 * @return {undefined}
 */
var NetworkSimulator = function(network) {
    this.sim = new Sim();

    // Record the network
    this.network = network;
    // Store edges
    this._storeEdges(network);

    this.router = new BasicRouter(network);
    this.apps = {};
};

/**
 * Record the network edges by src/dst.
 *
 * @private
 * @param {Array} edgeList
 * @return {undefined}
 */
NetworkSimulator.prototype._storeEdges = function(edgeList) {
    var edge,
        nodes = {},
        edges = {},
        i;

    for (i = edgeList.length; i--;) {
        edge = edgeList[i];
        this._initEdgeRecords(edges, edge.src, edge.dst);

        edges[edge.src][edge.dst] = edge;
        edges[edge.dst][edge.src] = edge;

        nodes[edge.src] = true;
        nodes[edge.dst] = true;
    }

    // Add self edges for every node
    var ids = Object.keys(nodes);
    for (i = ids.length; i--;) {
        edges[ids[i]][ids[i]] = {};
    }

    this._edges = edges;
};

/**
 * Initialize edge records.
 *
 * @param {Object} object
 * @param {String} param1
 * @param {String} param2
 * @return {Object} result
 */
NetworkSimulator.prototype._initEdgeRecords = function(object, param1, param2) {
    for (var i = arguments.length; i > 0; i--) {
        if (object[arguments[i]] === undefined) {
            object[arguments[i]] = {};
        }
    }
    return object;
};

/**
 * Add a node to the network. Id of the node should be present in the 
 * network topology.
 *
 * @param node
 * @return {undefined}
 */
NetworkSimulator.prototype.addNode = function(node) {
    this._validateNode(node);

    // Guarrantee that it has a start function
    var app = new App(node, this);

    // Record the app
    this.apps[app.uuid] = app;

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
    //    + have a uuid
    //    + be in the network topology
    //    + not have "sent" method -- will be overridden
    var isValid = true;

    isValid = node.uuid !== undefined &&
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
        exists = link.src === node.uuid || link.dst === node.uuid;
    }

    return exists;
};

/**
 * Start the simulation.
 *
 * @return {undefined}
 */
NetworkSimulator.prototype.simulate = function() {
    // Convert all remaining nodes in the topology to dumb routers
    this._convertRemainingApps();

    this._callOnStartForApps();

    // Start the simulation
    this.sim.simulate();
};

NetworkSimulator.prototype._callOnStartForApps = function() {
    var ids = Object.keys(this.apps);
    for (var i = ids.length; i--;) {
        this.apps[ids[i]].onStart();
    }
};

/**
 * Convert remaining apps to dumb routing apps.
 *
 * @return {undefined}
 */
NetworkSimulator.prototype._convertRemainingApps = function() {
    var nodeIds = Object.keys(Utils.getNetworkGraph(this.network)),
        app;

    // Add the routers first
    for (var i = nodeIds.length; i--;) {
        if (!this.apps[nodeIds[i]]) {
            this.addNode({uuid: nodeIds[i]});
        }
    }
};

NetworkSimulator.prototype.getLatency = function(srcId, dstId) {
    var mean = this._edges[srcId][dstId].latencyMean || 10,
        sigma = this._edges[srcId][dstId].latencySigma || 0,
        latency = normalRandom()*sigma+mean;

    return latency;
};

NetworkSimulator.prototype.isDropped = function(srcId, dstId) {
    var edge = this._edges[srcId][dstId],
        lossProbability = edge.packetLoss || 0;

    return Math.random() < lossProbability;
};

NetworkSimulator.prototype.getRoute = function(srcId, dstId) {
    var route = this.router.getRoute(srcId, dstId).slice();

    // Replace ids with actual nodes
    for (var i = route.length; i--;) {
        route[i] = this.apps[route[i]];
    }

    return route;
};

module.exports = NetworkSimulator;
