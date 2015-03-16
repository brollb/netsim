/*
 * Topologies are arrays of JSON object containing all connections between 
 * nodes. The nodes are implied by the connections.
 */
'use strict';

module.exports = [
    {src: 'node1', dst: 'node2', latencyMean: 100, latencySigma: 100},
    {src: 'node2', dst: 'node3', latencyMean: 100, latencySigma: 100}
];
