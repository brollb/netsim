/*
 * Topologies are arrays of JSON object containing all connections between 
 * nodes. The nodes are implied by the connections.
 *
 * This topology is simply a P4 (path on 4 vertices)
 */
'use strict';

module.exports = [
    {src: 'node1', dst: 'node2', packetLoss: 0.5},
    {src: 'node2', dst: 'node3', packetLoss: 0.5},
    {src: 'node3', dst: 'node4', packetLoss: 0.5}
];
