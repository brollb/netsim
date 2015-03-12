/*
 * Topologies are arrays of JSON object containing all connections between 
 * nodes. The nodes are implied by the connections.
 */
'use strict';

module.exports = [
    {src: 'node2', dst: 'node3', packet_loss: 0.5},
    {src: 'node3', dst: 'node7', packet_loss: 0.5},
    {src: 'node7', dst: 'node5', packet_loss: 0.5}
];
