/*
 * Topologies are arrays of JSON object containing all connections between 
 * nodes. The nodes are implied by the connections.
 *
 * This topology is simply a P4 (path on 4 vertices)
 */
'use strict';

module.exports = [
    {src: 'node1', dst: 'node2'},
    {src: 'node2', dst: 'node3'},
    {src: 'node3', dst: 'node4'}
];
