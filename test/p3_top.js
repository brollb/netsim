/*
 * Topologies are arrays of JSON object containing all connections between 
 * nodes. The nodes are implied by the connections.
 */
'use strict';

module.exports = [
    {src: 'node1', dst: 'node2', packet_loss: 0.5},
    {src: 'node2', dst: 'node3', packet_loss: 0.5}
];
