/*
 * Static utility functions for the network simulator.
 */
'use strict';

/**
 * Guarantee that an item has the given fields. If the field is missing, fill 
 * it with a "no operation" function.
 *
 * @param {Object} item
 * @param {String} fn1
 * @param {String} fn2
 * @return {undefined}
 */
var guaranteeFns = function(item, fn1, fn2) {
    var fn;

    for (var i = arguments.length-1; i > 0; i--) {
        fn = arguments[i];
        item[fn] = item[fn]|| nop;
    }

    return item;
};

//no operation
var nop = function() {
};

/**
 * Perform a shallow copy of "src" to "dst".
 *
 * @param {Object} dst
 * @param {Object} src
 * @return {Object} dst
 */
var copyObject = function(dst, src) {
    for (var key in src) {
        dst[key] = src[key];
    }
    return dst;
};

var addNodes = function(nodes, id1, id2) {
    var node;
    for (var i = arguments.length-1; i > 0; i--) {
        node = arguments[i];
        if (!nodes[node]) {
            nodes[node] = [];
        }
    }
};

/**
 * Retrieve all node ids from a network configuration.
 *
 * @private
 * @param network
 * @return {Array} nodes
 */
var getNetworkGraph = function(network) {
    var nodes = {},
        edge;

    for (var i = network.length; i--;) {
        edge = network[i];

        addNodes(nodes, edge.src, edge.dst);

        nodes[edge.src].push(edge.dst);
        nodes[edge.dst].push(edge.src);
    }

    return nodes;
};

module.exports = {
    getNetworkGraph: getNetworkGraph,
    guaranteeFns: guaranteeFns,
    copyObject: copyObject
};
