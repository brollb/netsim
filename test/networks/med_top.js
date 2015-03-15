/*
 * Network topology example
 *
 * n4 ---- n3
 * |  ____/
 * | /
 * n2 ---- n1
 *
 *
 */
'use strict';
module.exports = [
    {src: 'node1', dst: 'node2'},
    {src: 'node2', dst: 'node3'},
    {src: 'node3', dst: 'node4'},
    {src: 'node2', dst: 'node4'}
];
